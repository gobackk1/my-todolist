import { css } from '@emotion/core'

export const global = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  img {
    display: block;
    max-width: 100%;
  }

  body {
    line-height: 1.8;
  }

  html,
  body,
  [id='root'] {
    height: 100%;
  }
`
