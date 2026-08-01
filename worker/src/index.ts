interface Env {
  GITHUB_OAUTH_ID: string;
  GITHUB_OAUTH_SECRET: string;
  ALLOWED_USER: string;
  ALLOWED_ORIGIN: string;
  REPOSITORY: string;
  BRANCH: string;
}

type GitHubUser = {
  login?: string;
};

type GitHubRepository = {
  archived?: boolean;
  permissions?: {
    push?: boolean;
  };
};

const stateCookieName = 'decap_oauth_state';
const stateCookiePath = '/callback';
const stateLifetimeSeconds = 10 * 60;

function createState() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const value = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');

  return btoa(value).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function readCookie(request: Request, name: string) {
  const prefix = `${name}=`;
  const value = request.headers
    .get('Cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return value?.slice(prefix.length);
}

function statesMatch(expected: string, actual: string) {
  if (expected.length !== actual.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ actual.charCodeAt(index);
  }

  return difference === 0;
}

function stateCookie(state: string) {
  return `${stateCookieName}=${state}; HttpOnly; Secure; SameSite=Lax; Path=${stateCookiePath}; Max-Age=${stateLifetimeSeconds}`;
}

function clearStateCookie() {
  return `${stateCookieName}=; HttpOnly; Secure; SameSite=Lax; Path=${stateCookiePath}; Max-Age=0`;
}

function securityHeaders() {
  return {
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

function textResponse(message: string, status: number) {
  return new Response(message, {
    status,
    headers: securityHeaders(),
  });
}

function hasAllowedReferrer(request: Request, allowedOrigin: string) {
  const referrer = request.headers.get('Referer');

  if (!referrer) {
    return false;
  }

  try {
    return new URL(referrer).origin === allowedOrigin;
  } catch {
    return false;
  }
}

function popupResponse(allowedOrigin: string, status: 'success' | 'error', payload: Record<string, string>) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const serializedMessage = JSON.stringify(message).replaceAll('<', '\\u003c');
  const serializedOrigin = JSON.stringify(allowedOrigin).replaceAll('<', '\\u003c');

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Authorizing AI Study Blog</title>
  </head>
  <body>
    <p>Authorizing AI Study Blog…</p>
    <script>
      const allowedOrigin = ${serializedOrigin};
      const resultMessage = ${serializedMessage};
      const receiveMessage = (event) => {
        if (event.origin !== allowedOrigin) return;
        window.opener?.postMessage(resultMessage, allowedOrigin);
        window.removeEventListener('message', receiveMessage);
        window.close();
      };

      window.addEventListener('message', receiveMessage);
      window.opener?.postMessage('authorizing:github', allowedOrigin);
    </script>
  </body>
</html>`,
    {
      headers: {
        ...securityHeaders(),
        'Content-Security-Policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  );
}

function hasOAuthConfiguration(env: Env) {
  return Boolean(env.GITHUB_OAUTH_ID && env.GITHUB_OAUTH_SECRET);
}

async function exchangeCodeForToken(code: string, callbackUrl: string, env: Env) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_ID,
      client_secret: env.GITHUB_OAUTH_SECRET,
      code,
      redirect_uri: callbackUrl,
    }),
  });

  if (!response.ok) {
    throw new Error('GitHub access token exchange failed.');
  }

  const result = (await response.json()) as { access_token?: string };

  if (!result.access_token) {
    throw new Error('GitHub did not issue an access token.');
  }

  return result.access_token;
}

async function verifyAuthor(token: string, env: Env) {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'AI-Study-Blog-CMS',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const userResponse = await fetch('https://api.github.com/user', { headers });

  if (!userResponse.ok) {
    throw new Error('GitHub user verification failed.');
  }

  const user = (await userResponse.json()) as GitHubUser;

  if (user.login?.toLowerCase() !== env.ALLOWED_USER.toLowerCase()) {
    throw new Error('This GitHub account is not allowed to manage the blog.');
  }

  const repositoryResponse = await fetch(`https://api.github.com/repos/${env.REPOSITORY}`, { headers });

  if (!repositoryResponse.ok) {
    throw new Error('The configured repository could not be verified.');
  }

  const repository = (await repositoryResponse.json()) as GitHubRepository;

  if (repository.archived || !repository.permissions?.push) {
    throw new Error('This GitHub account cannot publish to the configured repository.');
  }
}

function callbackUrl(url: URL) {
  return `${url.origin}/callback`;
}

async function handleAuth(request: Request, url: URL, env: Env) {
  if (request.method !== 'GET') {
    return textResponse('Method not allowed.', 405);
  }

  if (!hasOAuthConfiguration(env)) {
    return textResponse('OAuth proxy configuration is incomplete.', 503);
  }

  if (url.searchParams.get('provider') !== 'github') {
    return textResponse('Invalid OAuth provider.', 400);
  }

  const hasAllowedOrigin = hasAllowedReferrer(request, env.ALLOWED_ORIGIN);
  console.log('GitHub OAuth authorization started.', { hasAllowedOrigin });

  if (!hasAllowedOrigin) {
    return textResponse('Unauthorized admin origin.', 403);
  }

  const state = createState();
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.search = new URLSearchParams({
    client_id: env.GITHUB_OAUTH_ID,
    redirect_uri: callbackUrl(url),
    scope: 'public_repo',
    state,
  }).toString();

  return new Response(null, {
    status: 302,
    headers: {
      ...securityHeaders(),
      Location: authorizeUrl.toString(),
      'Set-Cookie': stateCookie(state),
    },
  });
}

async function handleCallback(request: Request, url: URL, env: Env) {
  if (request.method !== 'GET') {
    return textResponse('Method not allowed.', 405);
  }

  if (!hasOAuthConfiguration(env)) {
    return textResponse('OAuth proxy configuration is incomplete.', 503);
  }

  const state = url.searchParams.get('state');
  const savedState = readCookie(request, stateCookieName);

  const hasValidState = Boolean(state && savedState && statesMatch(state, savedState));
  console.log('GitHub OAuth callback received.', {
    hasCode: Boolean(url.searchParams.get('code')),
    hasValidState,
  });

  if (!hasValidState) {
    return textResponse('OAuth state validation failed.', 403);
  }

  const error = url.searchParams.get('error');

  if (error) {
    const response = popupResponse(env.ALLOWED_ORIGIN, 'error', { error: 'GitHub authorization was cancelled.' });
    response.headers.set('Set-Cookie', clearStateCookie());
    return response;
  }

  const code = url.searchParams.get('code');

  if (!code) {
    return textResponse('Missing OAuth authorization code.', 400);
  }

  try {
    const token = await exchangeCodeForToken(code, callbackUrl(url), env);
    await verifyAuthor(token, env);
    const response = popupResponse(env.ALLOWED_ORIGIN, 'success', { token });
    response.headers.set('Set-Cookie', clearStateCookie());
    return response;
  } catch (error) {
    const failureMessage =
      error instanceof Error &&
      [
        'GitHub access token exchange failed.',
        'GitHub did not issue an access token.',
        'GitHub user verification failed.',
        'This GitHub account is not allowed to manage the blog.',
        'The configured repository could not be verified.',
        'This GitHub account cannot publish to the configured repository.',
      ].includes(error.message)
        ? error.message
        : 'GitHub OAuth callback failed unexpectedly.';

    console.error('GitHub OAuth callback failed:', failureMessage);

    const response = textResponse(`GitHub OAuth callback failed: ${failureMessage}`, 502);
    response.headers.set('Set-Cookie', clearStateCookie());
    return response;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return Response.json(
        {
          status: 'ok',
          repository: env.REPOSITORY,
          branch: env.BRANCH,
        },
        { headers: securityHeaders() },
      );
    }

    if (url.pathname === '/auth') {
      return handleAuth(request, url, env);
    }

    if (url.pathname === '/callback') {
      return handleCallback(request, url, env);
    }

    return textResponse('AI Study Blog CMS OAuth proxy', 200);
  },
};
