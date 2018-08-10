import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';

const input = 'src/index.ts';
const external = ['react', 'formik'];

const buildUMD = ({ isProduction = true }) => ({
  input,
  external,
  output: {
    name: 'FormikFields',
    file: `dist/formik-fields.umd${isProduction ? '.min' : ''}.js`,
    format: 'umd',
    sourcemap: true,
    globals: {
      react: 'React',
      formik: 'Formik'
    }
  },
  plugins: [
    json(),
    babel({ exclude: 'node_modules/**' }),
    resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    commonjs(),
    sourceMaps(),
    isProduction && filesize(),
    isProduction &&
      uglify({
        compress: {
          keep_infinity: true,
          pure_getters: true
        },
        warnings: true
      })
  ]
});

export default [
  buildUMD({ isProduction: false }),
  buildUMD({ isProduction: true }),
  {
    input,
    external: external.concat(Object.keys(pkg.dependencies)),
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
      babel({ exclude: 'node_modules/**' }),
      filesize()
    ]
  }
];
