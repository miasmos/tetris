import math from 'mathjs'

export class Matrix {
	static rotate(matrix) {	//[[1, 1, 1], [0, 1, 0]]
		let source = matrix.toArray(),
			rows = source.length,
			destination = []

		for (const index in source[0]) {
			destination.push([])
		}

		for (let index = source.length - 1; index >= 0; index--) {
			const row = source[index]

			for (const index1 in row) {
				const value = row[index1]
				destination[index1].push(value)
			}
		}

		return math.matrix(destination, 'sparse') //[[], []]
	}

	static log(_matrix) {
		const matrix = _matrix.toArray()
		let str = ''
		for (let index in matrix) {
			for (let index1 in matrix[index]) {
				str += matrix[index][index1] + ' '
			}
			str += '\n'
		}
		console.log(str + '\n')
	}
}