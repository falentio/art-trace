import * as v from "valibot";
export const shortText = () =>
	v.pipe(
		v.string(),
		v.minLength(0),
		v.maxLength(100),
	);

export const longText = () =>
	v.pipe(
		v.string(),
		v.minLength(0),
		v.maxLength(1000),
	);

export const titleText = () =>
	v.pipe(
		v.string(),
		v.minLength(1),
		v.maxLength(50),
	);

export const id = () =>
	v.pipe(
		v.string(),
		v.uuid(),
	);

export const coercedDate = () =>
	v.pipe(
		v.union([v.string(), v.date()]),
		v.transform((value) => new Date(value)),
	);
