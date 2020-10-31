import React from 'react'
import { css } from '@emotion/core'

export const LoadingSpinner: React.FC = () => (
  <div css={styles['spinner']} className="AppLoadingSpinner-root">
    <div css={styles['spinner-inner']}></div>
  </div>
)

const styles = {
  spinner: css`
    width: 40px;
    height: 40px;
    position: relative;
  `,
  'spinner-inner': css`
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: transparent;
    color: transparent;
    box-shadow: 0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 0 #9880ff,
      18px 0 0 0 #9880ff, 12.72984px 12.72984px 0 0 rgba(152, 128, 255, 0),
      0 18px 0 0 rgba(152, 128, 255, 0),
      -12.72984px 12.72984px 0 0 rgba(152, 128, 255, 0),
      -18px 0 0 0 rgba(152, 128, 255, 0),
      -12.72984px -12.72984px 0 0 rgba(152, 128, 255, 0);
    animation: dot-spin 1.5s infinite linear;

    @keyframes dot-spin {
      0%,
      100% {
        box-shadow: 0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 0 #9880ff,
          18px 0 0 0 #9880ff,
          12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          0 18px 0 -5px rgba(152, 128, 255, 0),
          -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          -18px 0 0 -5px rgba(152, 128, 255, 0),
          -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
      }
      12.5% {
        box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
          12.72984px -12.72984px 0 0 #9880ff, 18px 0 0 0 #9880ff,
          12.72984px 12.72984px 0 0 #9880ff,
          0 18px 0 -5px rgba(152, 128, 255, 0),
          -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          -18px 0 0 -5px rgba(152, 128, 255, 0),
          -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
      }
      25% {
        box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
          12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
          18px 0 0 0 #9880ff, 12.72984px 12.72984px 0 0 #9880ff,
          0 18px 0 0 #9880ff,
          -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          -18px 0 0 -5px rgba(152, 128, 255, 0),
          -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
      }
      37.5% {
        box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
          12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
          18px 0 0 -5px rgba(152, 128, 255, 0),
          12.72984px 12.72984px 0 0 #9880ff, 0 18px 0 0 #9880ff,
          -12.72984px 12.72984px 0 0 #9880ff,
          -18px 0 0 -5px rgba(152, 128, 255, 0),
          -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
      }
      50% {
        box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
          12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
          18px 0 0 -5px rgba(152, 128, 255, 0),
          12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          0 18px 0 0 #9880ff, -12.72984px 12.72984px 0 0 #9880ff,
          -18px 0 0 0 #9880ff,
          -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
      }
      62.5% {
        box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
          12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
          18px 0 0 -5px rgba(152, 128, 255, 0),
          12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          0 18px 0 -5px rgba(152, 128, 255, 0),
          -12.72984px 12.72984px 0 0 #9880ff, -18px 0 0 0 #9880ff,
          -12.72984px -12.72984px 0 0 #9880ff;
      }
      75% {
        box-shadow: 0 -18px 0 0 #9880ff,
          12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
          18px 0 0 -5px rgba(152, 128, 255, 0),
          12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          0 18px 0 -5px rgba(152, 128, 255, 0),
          -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          -18px 0 0 0 #9880ff, -12.72984px -12.72984px 0 0 #9880ff;
      }
      87.5% {
        box-shadow: 0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 0 #9880ff,
          18px 0 0 -5px rgba(152, 128, 255, 0),
          12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          0 18px 0 -5px rgba(152, 128, 255, 0),
          -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
          -18px 0 0 -5px rgba(152, 128, 255, 0),
          -12.72984px -12.72984px 0 0 #9880ff;
      }
    }
  `
}
