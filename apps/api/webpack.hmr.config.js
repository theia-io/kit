const { composePlugins, withNx } = require('@nx/webpack');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const webpack = require('webpack');

// Set true if you don't want type checking
const skipTypeChecking = false;

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({ skipTypeChecking }),
  (config, { options, context }) => {
    config.entry = [
      '../../node_modules/webpack/hot/poll?100',
      ...config.entry.main,
    ];
    config.externals = [
      ...config.externals,
      nodeExternals({
        exclude: ['../../node_modules/webpack/hot/poll?100'],
      }),
    ];

    config.plugins = [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.outputFileName,
        autoRestart: false,
      }),
    ];

    return config;
  },
);
