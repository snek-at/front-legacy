// Import Modules
import { IProvider } from "react-very-simple-oauth";

export const gitlabProvider: IProvider<boolean> = {
  //Get Request to the GitHub OAuth Authorize-Site
  buildAuthorizeUrl(): string {
    return `https://snek.at/gitlab`;
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
    let server = null;
    let username = null;
    const usernameMatch = redirectUrl.match(/username=([^&]+)/);
    if (usernameMatch) {
      username = usernameMatch[1];
    }

    const serverMatch = redirectUrl.match(/server=([^&]+)/);
    if (serverMatch) {
      server = serverMatch[1];
    }

    let data = {'server': server, 'username': username}
    return data;
  },
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
