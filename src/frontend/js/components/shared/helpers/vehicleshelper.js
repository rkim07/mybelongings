/**
 * Get vehicle most common colors
 *
 * @returns {({label: string, value: string}|{label: string, value: string}|{label: string, value: string}|{label: string, value: string}|{label: string, value: string})[]}
 */
export function getVehicleColors() {
	return [
		{
			value: 'black',
			label: 'Black'
		},
		{
			value: 'white',
			label: 'White'
		},
		{
			value: 'red',
			label: 'Red'
		},
		{
			value: 'blue',
			label: 'Blue'
		},
		{
			value: 'gray',
			label: 'Gray'
		},
		{
			value: 'silver',
			label: 'Silver'
		},
		{
			value: 'navy',
			label: 'Navy'
		},
		{
			value: 'beige',
			label: 'Beige'
		},
		{
			value: 'yellow',
			label: 'Yellow'
		},
		{
			value: 'orange',
			label: 'Orange'
		}
	];
}

/**
 * Get purchase price of a vehicle
 *
 * @returns {({label: string, value: string}|{label: string, value: string}|{label: string, value: string}|{label: string, value: string})[]}
 */
export function getVehiclePurchaseTypes() {
	return [
		{
			value: 'lease',
			label: 'Lease'
		},
		{
			value: 'finance',
			label: 'Finance'
		},
		{
			value: 'cash',
			label: 'Cash'
		},
		{
			value: 'gift',
			label: 'Gift'
		}
	];
}

/**
 * Get vehicle body styles
 *
 * @returns {({label: string, value: string}|{label: string, value: string}|{label: string, value: string}|{label: string, value: string}|{label: string, value: string})[]}
 */
export function getVehicleStyles() {
	return [
		{
			value: 'sedan',
			label: 'Sedan'
		},
		{
			value: 'coupe',
			label: 'Coupe'
		},
		{
			value: 'suv',
			label: 'SUV'
		},
		{
			value: 'sports',
			label: 'Sports Car'
		},
		{
			value: 'convertible',
			label: 'Convertible'
		},
		{
			value: 'hatchback',
			label: 'Hatchback'
		},
		{
			value: 'minivan',
			label: 'Mini Van'
		},
		{
			value: 'pickup',
			label: 'Pickup Truck'
		},
		{
			value: 'wagon',
			label: 'Station Wagon'
		}
	];
}
