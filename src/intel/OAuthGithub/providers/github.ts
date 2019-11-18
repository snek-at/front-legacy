// Import Modules
import { guid } from "../services/utilities";
import { IProvider } from "react-very-simple-oauth";

// Set the default values needed for an OAuth-Request
const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
const client_secret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
const state = guid();
const redirect_uri = encodeURIComponent(`https://snek.at/oauth`);
const proxyUrl = "https://cors-anywhere.herokuapp.com/";

export const githubProvider: IProvider<boolean> = {
  //Get Request to the GitHub OAuth Authorize-Site
  buildAuthorizeUrl(): string {
    return `https://github.com/login/oauth/authorize?redirect_uri=${redirect_uri}
        &client_id=${client_id}
        &client_secret=${client_secret}
        &scope=repo, user:email, read:user, read:org
        &state=${state}`;
  },

  // Catch any error that appears during the OAuth process
  extractError(redirectUrl: string): Error | undefined {
    const errorMatch = redirectUrl.match(/error=([^&]+)/);
    if (!errorMatch) {
      return undefined;
    }

    const errorReason = errorMatch[1];
    const errorDescriptionMatch = redirectUrl.match(
      /error_description=([^&]+)/,
    );
    const errorDescription = errorDescriptionMatch
      ? errorDescriptionMatch[1]
      : "";
    return new Error(
      `Error during login. Reason: ${errorReason} Description: ${errorDescription}`,
    );
  },

  // This function catches the the returned value
  async extractSession(redirectUrl: string) {
    let data = null;
    let code = null;
    const codeMatch = redirectUrl.match(/code=([^&]+)/);
    if (codeMatch) {
      code = codeMatch[1];
    }

    let state = null;
    const stateMatch = redirectUrl.match(/state=([^&]+)/);
    if (stateMatch) {
      state = stateMatch[1];
    }

    const AuthorizeUrl = `${proxyUrl}https://github.com/login/oauth/access_token?code=${code}
        &client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`;

    // POST request to get the access token from GitHub
    await fetch(AuthorizeUrl, {
      headers: {
        Accept: "application/json",
        "Access-Allow-Credentials": "True",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Vary: "Origin",
      },
      method: "POST",
    })
    .then(async res => await res.json())
    .then(async res => {
      const access_token = res.access_token
      // GET request to get the user used for OAuth 
      await fetch(`https://api.github.com/user?access_token=${access_token}`)
      .then(async res => await res.json())
      .then(res => {
        data = {'username':res.login, 'access_token': access_token};
        return data;
      });
    });
    return data;
  },
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
