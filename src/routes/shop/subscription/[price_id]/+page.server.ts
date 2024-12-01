import { stripe } from '$lib/stripe/stripe';
import { redirect } from '@sveltejs/kit';

export async function load({ url, cookies, params, locals }) {
	if (!locals.currentIdToken) {
		redirect(303, '/');
	}
	const email = locals.currentIdToken.email || '';

	// マネしちゃだめ！ URL から価格IDを取得する
	const priceId = params.price_id;

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
				price: priceId,
				quantity: 1
			}
		],
		mode: 'subscription',
		return_url: url.origin + '/shop/thanks?session_id={CHECKOUT_SESSION_ID}'
	});

	return {
		clientSecret: session.client_secret!,
		customerId
	};
}
