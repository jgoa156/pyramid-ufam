/** @type {import('next').NextConfig} */

require("dotenv").config();

const basePath = "";

module.exports = {
	/*async redirects() {
		return [
			{
				source: '/',
				destination: '/home',
				permanent: true
			}
		]
	},*/
	reactStrictMode: true,
	env: {
		basePath: basePath,
		img: `${basePath}/img`,
		api: `${basePath}/api`,
		title: "Pyramid",
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};
