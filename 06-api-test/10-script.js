function data() {
	return {
		data: {
			urls: [''],
			requests: []
		},
		url: '',
		method: '',
		endpoint: '',
		body: '',
		token: '',
		result: '',
		status: '',
		addUrl: '',
		addName: '',
		folder: '',
		activeLink: null,
		isLoading: false,
		selectedRequest: null,
		isContextMenuVisible: false,
		isContextMenuFolderVisible: false,
		isContextMenuFoldersVisible: false,
		contextMenuPosition: { x: 0, y: 0 },
		link: {
			backgroundColor: '#555',
			borderRadius: '5px',
			marginLeft: '-5px',
			paddingLeft: '5px',
			paddingRight: '5px',
			color: '#66b3ff'
		},
		linkFolder: {
			backgroundColor: '#555',
			borderRadius: '5px',
			marginLeft: '5px',
			paddingLeft: '5px',
			paddingRight: '5px',
			color: '#66b3ff'
		},
		init() {
			this.loadData()
		},
		loadData() {
			if (JSON.parse(localStorage.getItem('config'))) {
				this.data = JSON.parse(localStorage.getItem('config'))
			}
	
			this.url = this.data.urls[0]
		},
		handleItem(request) {
			this.activeLink = request;
			this.method = request.method
			this.endpoint = request.urn
			this.body = JSON.stringify(request.body, null, 2)
			this.result = ''
			this.status = ''
		},
		isActive(request) {
			return this.activeLink === request;
		},
		makeRequest() {
			if (this.method == '') {
				alert('Escolha um método.')
				return
			}
	
			this.isLoading = true
	
			var options = {
				method: this.method,
				headers: {
					'Content-Type': 'application/json'
				}
			}
			
			if (this.token != '') {
				options.headers.Authorization = this.token
			}
	
			if (this.method === 'POST' || this.method === 'PUT') {
				options.body = this.body
			}
		
			fetch(this.url + this.endpoint, options)
				.then(response => {
					this.status = response.status

          if (response.status === 204) {
              this.result = '204 No Content'
              this.isLoading = false
              return null
          }

					return response.json()
				})
				.then(data => {
          if (data === null) return

					this.result = JSON.stringify(data, null, 2)
	
					if (data.hasOwnProperty('token')) {
						this.token = data.token
					}
	
					this.isLoading = false
				})
				.catch(error => {
					this.result = 'Erro:' + error
					this.isLoading = false
				})
	
		},
		clearFields() {
			this.method = ''
			this.endpoint = ''
			this.body = ''
			this.token = ''
			this.result = ''
			this.status = ''
			this.activeLink = null
		},
		saveFile() {
			this.download('config.json', JSON.stringify(this.data, null, 2))
		},
		download(filename, text) {
			var element = document.createElement('a')
			element.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(text))
			element.setAttribute('download', filename)
		
			element.style.display = 'none'
			document.body.appendChild(element)
		
			element.click()
		
			document.body.removeChild(element)
		},
		openInsertUrl() {
			if (this.data.urls.length <= 0) {
				this.addUrl = this.url
			}
		},
		insertUrl() {
			this.data.urls.push(this.addUrl)
			this.url = this.addUrl
			this.addUrl = ''
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		removeUrl() {
			var indice = this.data.urls.indexOf(this.url)
			
			if (indice !== -1) {
				this.data.urls.splice(indice, 1)
			}
			
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		handleFileSelect() {
			var fileInput = document.getElementById('formFile')
			var file = fileInput.files[0]
			if (file) {
				this.readFileAsync(file)
					.then(fileContent => {
						this.data = JSON.parse(fileContent)
						this.url = this.data.urls[0]
						localStorage.setItem('config', JSON.stringify(this.data))
					})
					.catch(error => {
						console.error('Erro na leitura do arquivo:', error)
					})
			}
		},
		readFileAsync(file) {
			return new Promise((resolve, reject) => {
				var reader = new FileReader()
				reader.onload = e => resolve(e.target.result)
				reader.onerror = e => reject(e)
				reader.readAsText(file)
			})
		},
		saveRequest() {
			if (!this.activeLink) {
				$('#insertRequest').modal('show')
				return
			}
		
			var request = {
				name: this.activeLink.name,
				method: this.method,
				urn: this.endpoint,
			}
		
			if (this.method == 'POST' || this.method == 'PUT') {
				try {
					const requestBody = JSON.parse(this.body);
					if (typeof requestBody === 'object' && requestBody !== null) {
						request['body'] = requestBody;
					} else {
						request['body'] = {};
					}
				} catch (error) {
					request['body'] = {};
				}
			}
		
			const index = this.data.requests.findIndex(obj => obj.name === this.activeLink.name && obj.method === this.method)
		
			if (index !== -1) {
				this.data.requests.splice(index, 1);
			}
			
			this.data.requests.splice(index, 0, request)
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		createRequest() {
			const index = this.data.requests.findIndex(objeto => objeto.name === this.addName && objeto.method === this.method)
			
			if (index !== -1) {
				this.data.endpoints.splice(index, 1)
			}
			
			var request = {
				name: this.addName,
				method: this.method,
				urn: this.endpoint
			}
	
			this.activeLink = request
		
			if (this.method == 'POST' || this.method == 'PUT') {
				request['body'] = JSON.parse(this.body)
			}
		
			this.addName = ''
			this.data.requests.push(request)
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		saveAsRequest() {
			this.addName = this.activeLink.name
			$('#insertRequest').modal('show')
		},
		removeRequest() {
			this.data.requests = this.data.requests.filter(objeto =>
				objeto.name !== this.activeLink.name || objeto.method !== this.activeLink.method
			)
			this.method = ''
			this.endpoint = ''
			this.body = ''
			this.activeLink = null
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		showContextMenuRequest(event, request) {
			event.preventDefault()
			this.contextMenuPosition = { x: event.pageX, y: event.pageY }
			this.isContextMenuVisible = true
			this.selectedRequest = request
			document.addEventListener('click', this.closeContextMenuOutside)
		},
		showContextMenuFolders(event) {
			event.preventDefault()
			this.contextMenuPosition = { x: event.pageX, y: event.pageY }
			this.isContextMenuFoldersVisible = true
			this.isContextMenuVisible = false
			document.addEventListener('click', this.closeContextMenuOutside)
		},
		showContextMenuFolder(event) {
			event.preventDefault()
			this.contextMenuPosition = { x: event.pageX, y: event.pageY }
			this.isContextMenuFolderVisible = true
			this.isContextMenuFoldersVisible = false
			this.isContextMenuVisible = false
			document.addEventListener('click', this.closeContextMenuOutside)
		},
		closeContextMenuOutside(event) {
			if (!event.target.closest('.context-menu') && !event.target.hasAttribute('contextmenu')) {
				this.isContextMenuVisible = false
				this.isContextMenuFolderVisible = false
				this.isContextMenuFoldersVisible = false
				document.removeEventListener('click', this.closeContextMenuOutside)
			}
		},
		moveRequestToPosition(newIndex) {
			const currentIndex = this.data.requests.indexOf(this.selectedRequest)
			const removedItem = this.data.requests.splice(currentIndex, 1)[0]
			this.data.requests.splice(newIndex, 0, removedItem)
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		moveRequestUp() {
			const currentIndex = this.data.requests.indexOf(this.selectedRequest)
			console.log(currentIndex)
			const newIndex = currentIndex - 1
			this.moveRequestToPosition(newIndex)
		},
		moveRequestDown() {
			const currentIndex = this.data.requests.indexOf(this.selectedRequest)
			const newIndex = currentIndex + 1
			this.moveRequestToPosition(newIndex)
		},
		newFolder() {
			this.data.requests.push({folder: this.folder, requests: []})
			this.folder = ''
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		moveRequest(folder) {
			this.isContextMenuFoldersVisible = false
			const targetRequest = this.data.requests.find(request => request.folder === folder)
			targetRequest.requests.push(this.selectedRequest)
			this.data.requests = this.data.requests.filter(request =>
				request.name !== this.selectedRequest.name || request.method !== this.selectedRequest.method
			)
			localStorage.setItem('config', JSON.stringify(this.data))
		}
	}
}
