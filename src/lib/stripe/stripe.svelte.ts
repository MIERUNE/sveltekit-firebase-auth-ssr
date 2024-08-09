import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_KEY } from '$env/static/public';
import { browser } from '$app/environment';

function createStripe() {
	let stripe: Stripe | null = $state(null);
	let ready: boolean = $state(false);

	if (browser) {
		loadStripe(PUBLIC_STRIPE_KEY).then((s) => {
			stripe = s;
			ready = true;
		});
	}

	return {
		get stripe() {
			return stripe;
		},
		get ready() {
			return ready;
		}
	};
}

const sharedStripeState = createStripe();
export default sharedStripeState;
