// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import { includeIgnoreFile } from '@eslint/compat';
import perfectionist from 'eslint-plugin-perfectionist';

import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,

	{
		plugins: {
			perfectionist
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'off',
			/*
				This one is optional, if you decide to turn it off,
				Make sure you sanitize the html serverside before rendering,
				Never let user input change the html rendered.
			*/
			'svelte/no-at-html-tags': 'error',
			'perfectionist/sort-objects': 'off',
			'perfectionist/sort-imports': [
				'error',
				{
					type: 'line-length',
					order: 'asc',
					fallbackSort: { type: 'alphabetical' },
					ignoreCase: true,
					specialCharacters: 'keep',
					internalPattern: ['^~/.+', '^@/.+', '^\\$lib/.+'],
					partitionByComment: true,
					partitionByNewLine: false,
					newlinesBetween: 1,

					// ✅ Updated groups (Perfectionist selectors)
					groups: [
						'type',
						'builtin',
						'external',
						'internal',
						['parent', 'sibling', 'index'],
						'side-effect',
						'side-effect-style',
						'style',
						'ts-equals-import',
						'unknown'
					]
				}
			],

			'perfectionist/sort-named-imports': [
				'error',
				{
					type: 'line-length',
					order: 'asc',
					ignoreCase: true,
					ignoreAlias: false,

					groups: ['type-import', 'value-import']
				}
			]
		},
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},
	{
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				projectService: true,
				parser: ts.parser,
				svelteConfig
			}
		},
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js']
	}
);
//
