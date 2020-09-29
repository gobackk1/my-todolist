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
`
