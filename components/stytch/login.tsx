"use client";

import React from "react";
import { StytchLogin } from "@stytch/nextjs";
import { Products } from "@stytch/vanilla-js";

//http://localhost:3000/authenticate?redirect=http%3A%2F%2Flocalhost%3A3000%2Fregister%3Fredirect%3Dhttp%253A%252F%252Flocalhost%253A3000%252F

/*
 * Login configures and renders the StytchLogin component which is a prebuilt UI component for auth powered by Stytch.
 *
 * This component accepts style, config, and callbacks props. To learn more about possible options review the documentation at
 * https://stytch.com/docs/sdks/javascript-sdk#ui-configs.
 */
export const Login = () => {
  let origin = null;

  if (typeof window !== "undefined") {
    origin = window.location.origin;
  }

  const styles = {
    container: {
      width: "100%",
    },
    buttons: {
      primary: {
        backgroundColor: "#4A37BE",
        borderColor: "#4A37BE",
      },
    },
  };

  const config = {
    products: [Products.emailMagicLinks],
    emailMagicLinksOptions: {
      loginExpirationMinutes: 60,
      signupExpirationMinutes: 60,
    },
  } as Parameters<typeof StytchLogin>[0]["config"];

  return <StytchLogin config={config} styles={styles} />;
};
