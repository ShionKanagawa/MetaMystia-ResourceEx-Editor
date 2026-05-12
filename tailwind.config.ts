/* eslint-disable sort-keys */

import { type Config } from 'tailwindcss';
import { heroui } from '@heroui/theme';

import {
	fontFamily,
	getExtendConfig,
	semanticColors,
} from './src/design/theme';

const herouiComponents = [
	'avatar',
	'badge',
	'button',
	'card',
	'dropdown',
	'link',
	'modal',
	'navbar',
	'pagination',
	'popover',
	'scroll-shadow',
	'snippet',
	'switch',
	'tooltip',
	'toggle',
];

const config: Config = {
	content: [
		'./src/**/*.{ts,tsx}',
		`./node_modules/@heroui/theme/dist/components/(${herouiComponents.join('|')}).js`,
	],
	darkMode: 'selector',
	theme: { extend: getExtendConfig(''), fontFamily },
	plugins: [
		heroui({
			themes: {
				'izakaya-dark': { extend: 'dark', colors: semanticColors.dark },
				izakaya: { extend: 'light', colors: semanticColors.light },
			},
		}),
	],
};

export default config;
