// 3rd party
import { AtpAgent } from '@atproto/api';

// AWS and Shared Layer
import { Handler } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

// TS Types
import { RespData } from 'types/data';
import getCreateBksyId from './get-create-bskyid.js';

const dynamoClient = new DynamoDB({});
const ddbClient = DynamoDBDocument.from(dynamoClient); // client is DynamoDB client

const handler: Handler = async (event) => {
	// pull data from the event
	// const evtBody: any = event.body || {}; - will need this for any POS/PUT routes
	const pathParams: { [key: string]: string } = event.pathParameters || {};
	const routeKey: string = event.routeKey || '';

	// Response variables
	let respData: RespData = {};
	const errorMessages: string[] = [];
	let message = 'Success';
	let statusCode = 200;

	// Handle api requests
	switch (routeKey) {
		case 'GET /':
			message = 'Nothing to see here!';
			break;

		case 'GET /lookup/{bskyId}':
			try {
				const { bskyId } = pathParams;

				// Connect to bsky - TODO: Move this to oauth or at least not my personal account
				const bskyAgent = new AtpAgent({ service: 'https://bsky.social' });
				await bskyAgent.login({
					identifier: 'cwbuecheler.bsky.social',
					password: process.env.BSKY_PASS || '',
				});

				const { data: feedData } = await bskyAgent.getAuthorFeed({
					actor: bskyId,
					filter: 'posts_and_author_threads',
					limit: 30,
				});

				respData = feedData;
			} catch (err: any) {
				errorMessages.push(err.message);
				statusCode = 500;
				console.error(err);
			}
			message = 'Lookup Successful';
			break;

		case 'GET /create/{bskyId}': {
			const { bskyId } = pathParams;

			try {
				// Connect to bsky - TODO: Move this to oauth or at least not my personal account
				const bskyAgent = new AtpAgent({ service: 'https://bsky.social' });
				await bskyAgent.login({
					identifier: 'cwbuecheler.bsky.social',
					password: process.env.BSKY_PASS || '',
				});

				respData = await getCreateBksyId(bskyId, respData, ddbClient, bskyAgent);
			} catch (err: any) {
				errorMessages.push(err.message);
				statusCode = 500;
				console.error(err);
			}
			message = `Successfully created feed HTML and saved to CDN`;
			break;
		}

		default:
			errorMessages.push('Route Not Found');
			message = 'Route Not Found';
			statusCode = 404;
			break;
	}

	dynamoClient.destroy(); // destroys DynamoDBClient

	/* Model
	/* AWS Requires a statusCode (number) and body (string)
	/* Our body contains:
	/*   data: any (for now)
	/*   message: string
	/*   errorMessages: string[]
	*/

	return {
		statusCode,
		body: JSON.stringify({
			data: respData,
			message,
			errorMessages,
		}),
	};
};

export { handler };