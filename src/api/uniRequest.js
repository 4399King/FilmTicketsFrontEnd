/** 
 * @param {String} api = [''] 
 * @param {String} method = ['GET'] 
 * @param {Object} data = [{}] 
 */
export async function myRequest(api, method, data) {
	try {
		let { data: { code, data } } = await new Promise((resolve, reject) => {
			uni.request({
				url: `https://film.sipc115.com${api}`,
				method,
				header: {
					'Content-Type': 'application/json',
					'Authorization': uni.getStorageSync('token')
				},
				data,
				success: resolve,
				fail: reject
			})
		})
		switch (code) {
			case '00000':
				return data
				break
			default:
				throw new Error(data)
		}

	} catch (e) {
		//TODO handle the exception
		console.error(e)
	}
}