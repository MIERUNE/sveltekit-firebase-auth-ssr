import { stripe } from '$lib/stripe/stripe';
import { redirect } from '@sveltejs/kit';

export async function load({ url, cookies, locals }) {
	if (!locals.currentIdToken) {
		redirect(307, '/');
	}
	const email = locals.currentIdToken.email;

	// DO NOT DO THIS IN PRODUCTION!!!
	// DO NOT DO THIS IN PRODUCTION!!!
	let customerId = cookies.get('customer_id');
	if (!customerId) {
		const customer = await stripe.customers.create({
			email
		});
		customerId = customer.id;
		cookies.set('customer_id', customerId, { path: '/' });
	}

	const session = await stripe.checkout.sessions.create({
		ui_mode: 'embedded',
		customer: customerId,
		line_items: [
			{
				price: 'price_1PkKYCLtNIgQdVMEIO2U71nd', // Dorayaki
				quantity: 1
			}
		],
		mode: 'payment',
		return_url: url.origin + '/shop/thanks?session_id={CHECKOUT_SESSION_ID}'
	});

	return {
		clientSecret: session.client_secret!,
		customerId: customerId
	};
}
