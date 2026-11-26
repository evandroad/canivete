function data() {
	return {
		data: {
			urls: [''],
			requests: []
		},
		formRequest: {},
		url: '',
		token: '',
		result: '',
		status: '',
		addUrl: '',
		addName: '',
		addFolder: '',
		activeLink: null,
		isLoading: false,
		showInsertUrl: false,
		showCreateFolder: false,
		selectedRequest: null,
		isContextMenuVisible: false,
		isContextMenuFolderVisible: false,
		isContextMenuFoldersVisible: false,
		contextMenuPosition: { x: 0, y: 0 },
		link: {
			backgroundColor: '#243544',
			borderRadius: '5px',
			marginLeft: '-5px',
			paddingLeft: '5px',
			paddingRight: '5px',
			color: '#66b3ff'
		},
		linkFolder: {
			backgroundColor: '#243544',
			borderRadius: '5px',
			marginLeft: '8px',
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
		handleItem(item) {
			this.activeLink = item;

			this.formRequest = {
				name: item.name || '',
				method: item.method || '',
				endpoint: item.endpoint || '',
				body: item.body ? JSON.stringify(item.body, null, 2) : '',
				folder: item.folder || ''
			};

			this.result = '';
			this.status = '';
		},
		isActive(item) {
			return this.activeLink === item
		},
		makeRequest() {
			if (this.formRequest.method == undefined) {
				alert('Escolha um método.')
				return
			}
	
			this.isLoading = true

			var options = {
				method: this.formRequest.method,
				headers: {
					'Content-Type': 'application/json'
				}
			}
			
			if (this.token != '') {
				options.headers.Authorization = this.token
			}
	
			if (this.formRequest.method === 'POST' || this.formRequest.method === 'PUT') {
				options.body = this.formRequest.body
			}
		
			fetch(this.url + this.formRequest.endpoint, options)
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
			this.formRequest = {}
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
			this.showInsertUrl = true
		},
		insertUrl() {
			if (!this.data.urls.includes(this.addUrl)) {
				this.data.urls.push(this.addUrl)
				return
			}
			this.url = this.addUrl
			this.addUrl = ''
			localStorage.setItem('config', JSON.stringify(this.data))
			this.showInsertUrl = false
		},
		removeUrl() {
			const indice = this.data.urls.indexOf(this.url)
			
			if (indice !== -1) {
				this.data.urls.splice(indice, 1)
			}
	
    	this.url = this.data.urls[0] || ''
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
			if (!this.formRequest.name) {
				alert('Por favor, preencha o nome da requisição.')
				return
			}

			if (!this.activeLink) {
				this.createRequest()
				return
			}
		
			const request = {
				...this.activeLink,
				id: this.activeLink.id || crypto.randomUUID(),
				name: this.formRequest.name,
        method: this.formRequest.method,
        endpoint: this.formRequest.endpoint,
				folder: this.activeLink.folder || ''
    	}
		
			if (this.formRequest.method == 'POST' || this.formRequest.method == 'PUT') {
				try {
					const requestBody = JSON.parse(this.formRequest.body)
					request.body = typeof requestBody === 'object' && requestBody !== null ? requestBody : {}
				} catch (error) {
					request['body'] = {}
				}
			}

			const index = this.data.requests.findIndex(r => r === this.activeLink)

			if (index !== -1) {
				this.data.requests.splice(index, 1, request)
				this.activeLink = request
			} else {
				console.log('Request não encontrado:', this.activeLink)
			}

			localStorage.setItem('config', JSON.stringify(this.data))
			this.showNotification('Requisição salva com sucesso!')
		},
		createRequest() {
			if (!this.formRequest.name) {
				alert('Por favor, preencha o nome da requisição.')
				return
			}

			const request = {
				...this.activeLink,
				...this.request,
				id: crypto.randomUUID(),
				name: this.formRequest.name,
				method: this.formRequest.method || '',
        endpoint: this.formRequest.endpoint,
				folder: ''
			}
	
			if (this.formRequest.method == 'POST' || this.formRequest.method == 'PUT') {
				request['body'] = JSON.parse(this.formRequest.body)
			}

			this.activeLink = request
		
			this.addName = ''
			this.data.requests.push(request)
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		removeRequest() {
			this.data.requests = this.data.requests.filter(objeto =>
				objeto.name !== this.activeLink.name ||
				objeto.method !== this.activeLink.method ||
				objeto.folder !== this.activeLink.folder ||
				objeto.endpoint !== this.activeLink.endpoint
			)
			this.method = ''
			this.endpoint = ''
			this.body = ''
			this.activeLink = null
			this.formRequest = {}
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
		showContextMenuFolder(event, folder) {
			event.preventDefault()
			this.selectedFolder = folder;
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
			const newIndex = currentIndex - 1
			this.moveRequestToPosition(newIndex)
			this.isContextMenuVisible = false
		},
		moveRequestDown() {
			const currentIndex = this.data.requests.indexOf(this.selectedRequest)
			const newIndex = currentIndex + 1
			this.moveRequestToPosition(newIndex)
			this.isContextMenuVisible = false
		},
		moveFolderToPosition(newIndex) {
			const currentIndex = this.data.requests.indexOf(this.selectedFolder)

			if (currentIndex === -1 || newIndex < 0 || newIndex >= this.data.requests.length) {
				return
			}

			const removedItem = this.data.requests.splice(currentIndex, 1)[0]
			this.data.requests.splice(newIndex, 0, removedItem)
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		moveFolderUp() {
			const currentIndex = this.data.requests.indexOf(this.selectedFolder)
			this.moveFolderToPosition(currentIndex - 1)
			this.isContextMenuFolderVisible = false
		},
		moveFolderDown() {
			const currentIndex = this.data.requests.indexOf(this.selectedFolder)
			this.moveFolderToPosition(currentIndex + 1)
			this.isContextMenuFolderVisible = false
		},
		newFolder() {
			this.data.folders.push(this.addFolder)
			this.addFolder = ''
			localStorage.setItem('config', JSON.stringify(this.data))
			this.showCreateFolder = false
		},
		moveRequest(folder) {
			this.isContextMenuFoldersVisible = false
			const selectedRequest = this.selectedRequest
			const targetFolder = this.data.requests.find(request => request.folder === folder)
			if (!targetFolder) return

		  for (const item of this.data.requests) {
        if (item.requests) {
					const index = item.requests.indexOf(selectedRequest)

					if (index !== -1) {
						item.requests.splice(index, 1)
						break
					}
        }
    	}

			const rootIndex = this.data.requests.indexOf(selectedRequest)
			if (rootIndex !== -1) this.data.requests.splice(rootIndex, 1)

			targetFolder.requests.push(selectedRequest)
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		moveOutOfTheFolder() {
			const folder = this.data.requests.find(item => item.requests && item.requests.includes(this.selectedRequest))
			if (!folder) return
			folder.requests = folder.requests.filter(request => request !== this.selectedRequest)
			this.data.requests.push(this.selectedRequest)
			localStorage.setItem('config', JSON.stringify(this.data))
			this.isContextMenuVisible = false
		},
		deleteFolder() {
  		const folder = this.selectedFolder

			this.data.folders = this.data.folders.filter(item => item !== folder)
			this.data.requests = this.data.requests.filter(request => request.folder !== folder)

			localStorage.setItem('config', JSON.stringify(this.data))

			this.selectedFolder = null
			this.isContextMenuFolderVisible = false
		},
		showNotification(message, type = 'success') {
			const notification = document.createElement('div')

			const colors = {
				success: 'bg-green-800',
				error: 'bg-red-800',
				warning: 'bg-yellow-800',
				info: 'bg-blue-800'
			}

			notification.textContent = message
			notification.className = `
				fixed top-5 left-1/2 -translate-x-1/2 z-[9999]
				${colors[type] || colors.info}
				text-white px-4 py-3 rounded-lg shadow-lg
				transition-opacity duration-300
			`

			document.body.appendChild(notification)

			setTimeout(() => {
				notification.classList.add('opacity-0')
				setTimeout(() => notification.remove(), 300)
			}, 3000)
		}
	}
}
