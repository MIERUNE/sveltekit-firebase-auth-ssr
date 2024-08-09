import { stripe } from '$lib/stripe/stripe';
import { redirect } from '@sveltejs/kit';

export async function load({ url, cookies, locals }) {
	if (!locals.currentUser) {
		redirect(303, '/');
	}
	const email = locals.currentUser.email;

	// マネしちゃだめ！
	// 永続化層がないので、 Cookieを使ってStripeの顧客IDを保持しておく
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
				price: 'price_1PkKYCLtNIgQdVMEIO2U71nd', // どら焼き
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
