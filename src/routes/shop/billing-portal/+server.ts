import { redirect } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';

export async function GET({ url, cookies, locals }) {
	if (!locals.currentUser) {
		redirect(302, '/');
	}
	const email = locals.currentUser.email;

	// キケン！
	// Cookieを使ってStripeの顧客IDを保持する
	let customerId = cookies.get('customer_id');
	if (!customerId) {
		const customer = await stripe.customers.create({
			email
		});
		customerId = customer.id;
		cookies.set('customer_id', customerId, { path: '/' });
	}

	if (customerId === undefined) {
		throw redirect(302, '/');
	}

	const billingPortalSession = await stripe.billingPortal.sessions.create({
		// configuration: bpc.id, // Billing Portal をカスタムする場合
		customer: customerId,
		return_url: url.origin + '/'
	});
	throw redirect(302, billingPortalSession.url);
}
