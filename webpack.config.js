module.exports = (config, context) => {
  return {
    ...config,
    node: {
      global: true,
    },
    resolve: {
      fallback: {
        'process/browser': require.resolve('process/browser')
      }
              options: {
                // Prefer `dart-sass`
                implementation: require("sass"),
              },
            },
            "source-map-loader"
          ],
        },
      ],
    },
    ignoreWarnings: [/Failed to parse source map/],
  };
};