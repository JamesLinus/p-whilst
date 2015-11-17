import test from 'ava';
import fn from './';

test('whilst', async t => {
	const result = [];
	let counter = 0;

	await fn(() => {
		return result.length < 7
	}, () => {
		result.push(counter++);
	});

	t.is(counter, 7);
	t.same(result, [0, 1, 2, 3, 4, 5, 6]);
});

test('works with action returning a promise', async t => {
	const result = [];
	let counter = 0;

	await fn(() => {
		return result.length < 7;
	}, () => {
		return new Promise(resolve => {
			result.push(counter++);
			resolve();
		});
	});

	t.is(counter, 7);
	t.same(result, [0, 1, 2, 3, 4, 5, 6]);
});

test('stops on error', async t => {
	const result = [];
	let counter = 0;

	const prom = fn(() => {
		return result.length < 7;
	}, () => {
		return new Promise(resolve => {
			if (counter === 7) {
				throw new Error('BAAD');
			}

			result.push(counter++);
			resolve();
		});
	});

	try {
		await prom;
	} catch (err) {
		t.is(e.message, 'BAAD');
	}

	t.is(counter, 7);
	t.same(result, [0, 1, 2, 3, 4, 5, 6]);
});