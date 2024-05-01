/** 
 * @param {String} api = [''] 
 * @param {String} method = ['GET'] 
 * @param {Object} data = [{}] 
 */
export async function myRequest(api, method, requestData) {
	try {
		let { data: { code, data, message } } = await new Promise((resolve, reject) => {
			console.log('退票数据', requestData)
			uni.request({
				url: `https://film.sipc115.com${api}`,
				method,
				header: {
					'Content-Type': 'application/json',
					'Authorization': uni.getStorageSync('token')
				},
				data: requestData,
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