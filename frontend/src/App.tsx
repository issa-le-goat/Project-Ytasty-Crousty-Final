import { useEffect, useMemo, useState, type FormEvent } from 'react'
import './app.css'
import { Link } from 'react-router-dom'
import {
	Alert,
	Avatar,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	IconButton,
	InputAdornment,
	MenuItem,
	Paper,
	Select,
	Snackbar,
	Switch,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import EditRounded from '@mui/icons-material/EditRounded'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import KitchenOutlined from '@mui/icons-material/KitchenOutlined'
import LogoutRounded from '@mui/icons-material/LogoutRounded'
import RestaurantMenuRounded from '@mui/icons-material/RestaurantMenuRounded'
import SearchRounded from '@mui/icons-material/SearchRounded'
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined'
import TimerOutlined from '@mui/icons-material/TimerOutlined'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import {
	api,
	getErrorMessage,
	getStaffFromToken,
	TOKEN_KEY,
	type Order,
	type Product,
	type ProductInput,
	type Restaurant,
	type StaffUser,
} from './api'

type View = 'orders' | 'menu'
type OrderStatus = Order['status']

const statusColumns: { status: OrderStatus[]; title: string; color: string; next?: OrderStatus; action?: string }[] = [
	{ status: ['pending', 'validated'], title: 'À lancer', color: '#db754d', next: 'preparing', action: 'Lancer' },
	{ status: ['preparing'], title: 'En préparation', color: '#477b61', next: 'ready', action: 'Marquer prête' },
	{ status: ['ready'], title: 'Prêtes', color: '#547b9a' },
]

const emptyProduct: ProductInput = {
	name: '',
	image: '',
	description: '',
	category: '',
	price: 0,
	is_available: true,
	restaurant_id: 0,
	ingredients: [],
}

function ProtectedRoute({ user, children }: { user: StaffUser | null; children: React.ReactNode }) {
	if (!user || !['admin', 'staff', 'direction'].includes(user.role)) return <LoginPage onLogin={() => window.location.reload()} />
	return children
}

function App() {
	const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY))
	const [view, setView] = useState<View>('orders')
	const [notice, setNotice] = useState('')

	const user = useMemo(() => token ? getStaffFromToken(token) : null, [token])
	useEffect(() => {
		const expireSession = () => setToken(null)
		window.addEventListener('auth:expired', expireSession)
		return () => window.removeEventListener('auth:expired', expireSession)
	}, [])

	const logout = () => {
		sessionStorage.removeItem(TOKEN_KEY)
		setToken(null)
	}

	if (!user) return <LoginPage onLogin={() => setToken(sessionStorage.getItem(TOKEN_KEY))} />

	return (
		<ProtectedRoute user={user}>
			<div className="app-shell">
				<aside className="sidebar">
					<div className="brand-lockup">
						<div className="brand-mark"><RestaurantMenuRounded /></div>
						<div><strong>ytasty</strong><span>ESPACE ÉQUIPE</span></div>
					</div>
					<div className="sidebar-label">OPÉRATIONS</div>
					<nav className="side-nav" aria-label="Navigation principale">
						<button className={view === 'orders' ? 'nav-item active' : 'nav-item'} onClick={() => setView('orders')}>
							<KitchenOutlined /> <span>Cuisine</span>
						</button>
						<button className={view === 'menu' ? 'nav-item active' : 'nav-item'} onClick={() => setView('menu')}>
							<Inventory2Outlined /> <span>Carte produits</span>
						</button>
					</nav>
					<div className="sidebar-bottom">
						<div className="sidebar-note"><span className="live-dot" /> Service en direct</div>
						<Divider />
						<div className="user-row">
							<Avatar className="user-avatar">{user.username.slice(0, 1).toUpperCase()}</Avatar>
							<div className="user-meta"><strong>{user.username}</strong><span>{roleName(user.role)}</span></div>
							<Tooltip title="Se déconnecter"><IconButton size="small" aria-label="Se déconnecter" onClick={logout}><LogoutRounded fontSize="small" /></IconButton></Tooltip>
						</div>
					</div>
				</aside>
				<main className="main-panel">
					<header className="topbar">
						<div><span className="topbar-kicker">BACK-OFFICE / {view === 'orders' ? 'CUISINE' : 'CATALOGUE'}</span><h1>{view === 'orders' ? 'Tableau de cuisine' : 'Gestion de la carte'}</h1></div>
						<div className="topbar-actions">
							<Button component={Link} to="/catalogue" size="small" variant="outlined">Site client</Button>
							<div className="topbar-badge"><span className="live-dot" /> Opérationnel</div>
						</div>
					</header>
					{view === 'orders'
						? <KitchenDashboard user={user} onNotify={setNotice} />
						: <ProductManagement user={user} onNotify={setNotice} />}
				</main>
				<Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
					<Alert severity="success" variant="filled" onClose={() => setNotice('')}>{notice}</Alert>
				</Snackbar>
			</div>
		</ProtectedRoute>
	)
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const submit = async (event: FormEvent) => {
		event.preventDefault()
		setLoading(true)
		setError('')
		try {
			const response = await api.post('/auth/login', { username, password })
			const accessToken = response.data.access_token as string
			if (!getStaffFromToken(accessToken)) throw new Error('Compte non autorisé pour cet espace.')
			sessionStorage.setItem(TOKEN_KEY, accessToken)
			onLogin()
		} catch (requestError) {
			setError(requestError instanceof Error && requestError.message.startsWith('Compte')
				? requestError.message
				: getErrorMessage(requestError))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="login-page">
			<section className="login-aside">
				<div className="login-brand"><RestaurantMenuRounded /><span>ytasty crousty</span></div>
				<div className="login-message"><span className="eyebrow">L'ESPACE DES ÉQUIPES</span><h1>Le service<br />bien orchestré.</h1><p>Cuisine et carte, réunies au même endroit.</p></div>
				<div className="login-aside-footer"><span className="live-dot" /> Votre restaurant, en temps réel</div>
			</section>
			<section className="login-form-wrap">
				<Paper className="login-form-paper" elevation={0} component="form" onSubmit={submit}>
					<span className="eyebrow">ACCÈS SÉCURISÉ</span>
					<Typography variant="h4" component="h2" className="login-title">Ravi de vous revoir.</Typography>
					<Typography color="text.secondary" className="login-subtitle">Connectez-vous à votre espace de travail.</Typography>
					{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
					<TextField label="Identifiant" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required fullWidth autoFocus />
					<TextField label="Mot de passe" value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required fullWidth />
					<Button type="submit" variant="contained" size="large" disabled={loading} endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardRounded />}>
						Se connecter
					</Button>
					<div className="login-security">Accès réservé au personnel autorisé</div>
				</Paper>
			</section>
		</div>
	)
}

function KitchenDashboard({ user, onNotify }: { user: StaffUser; onNotify: (message: string) => void }) {
	const [restaurants, setRestaurants] = useState<Restaurant[]>([])
	const [restaurantId, setRestaurantId] = useState(user.restaurant_id ?? 0)
	const [orders, setOrders] = useState<Order[]>([])
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [search, setSearch] = useState('')

	useEffect(() => {
		api.get<Restaurant[]>('/restaurants').then(({ data }) => {
			setRestaurants(data)
			if (!restaurantId && data.length) setRestaurantId(data[0].id)
		}).catch((requestError) => setError(getErrorMessage(requestError)))
	}, [])

	useEffect(() => {
		if (!restaurantId) return
		let active = true
		const load = async (showLoader = false) => {
			if (showLoader) setLoading(true)
			try {
				const [orderResponse, productResponse] = await Promise.all([
					api.get<Order[]>(`/restaurants/${restaurantId}/orders`),
					api.get<Product[]>('/products', { params: { restaurant_id: restaurantId } }),
				])
				if (active) {
					setOrders(orderResponse.data)
					setProducts(productResponse.data)
					setError('')
				}
			} catch (requestError) {
				if (active) setError(getErrorMessage(requestError))
			} finally {
				if (active && showLoader) setLoading(false)
			}
		}
		void load(true)
		const timer = window.setInterval(() => void load(), 30000)
		return () => { active = false; window.clearInterval(timer) }
	}, [restaurantId])

	const changeStatus = async (order: Order, status: OrderStatus) => {
		try {
			const { data } = await api.patch<Order>(`/orders/${order.order_number}/status`, { status })
			setOrders((current) => current.map((item) => item.order_number === data.order_number ? data : item))
			onNotify(`${order.order_number} · ${statusLabel(status)}`)
		} catch (requestError) { setError(getErrorMessage(requestError)) }
	}

	const restaurant = restaurants.find((item) => item.id === restaurantId)
	const activeOrders = orders.filter((order) => !['collected', 'cancelled'].includes(order.status))

	return (
		<section className="content-area">
			<div className="dashboard-toolbar">
				<div className="service-copy"><span className="eyebrow">SUIVI DES COMMANDES</span><p>Les commandes se synchronisent automatiquement.</p></div>
				<div className="toolbar-controls">
					{user.role === 'staff' ? <div className="restaurant-fixed"><RestaurantMenuRounded fontSize="small" />{restaurant?.name ?? 'Mon restaurant'}</div> : (
						<FormControl size="small" className="restaurant-select">
							<Select value={restaurantId || ''} displayEmpty onChange={(event) => setRestaurantId(Number(event.target.value))} aria-label="Filtrer par restaurant">
								{!restaurants.length && <MenuItem value="" disabled>Aucun restaurant</MenuItem>}
								{restaurants.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
							</Select>
						</FormControl>
					)}
					<TextField size="small" placeholder="Chercher une commande" value={search} onChange={(event) => setSearch(event.target.value)} className="order-search" InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment> }} />
				</div>
			</div>
			{error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
			{loading ? <div className="loading-state"><CircularProgress /><span>Chargement des commandes</span></div> : (
				<div className="kanban-board">
					{statusColumns.map((column) => {
						const columnOrders = activeOrders.filter((order) => column.status.includes(order.status) && order.order_number.toLowerCase().includes(search.toLowerCase()))
						return <section className="kanban-column" key={column.title}>
							<header className="column-heading"><div><span className="column-dot" style={{ background: column.color }} /><h2>{column.title}</h2></div><span className="column-count">{columnOrders.length.toString().padStart(2, '0')}</span></header>
							<div className="order-stack">
								{columnOrders.map((order) => <OrderCard key={order.order_number} order={order} products={products} next={column.next} action={column.action} onAdvance={changeStatus} />)}
								{!columnOrders.length && <div className="empty-column">Rien à signaler</div>}
							</div>
						</section>
					})}
				</div>
			)}
			<footer className="board-footer"><span><TimerOutlined fontSize="small" /> Actualisation toutes les 30 secondes</span><span>{activeOrders.length} commande{activeOrders.length > 1 ? 's' : ''} en cours · {restaurant?.name ?? 'Restaurant'}</span></footer>
		</section>
	)
}

function OrderCard({ order, products, next, action, onAdvance }: { order: Order; products: Product[]; next?: OrderStatus; action?: string; onAdvance: (order: Order, status: OrderStatus) => void }) {
	const productById = new Map(products.map((product) => [product.id, product.name]))
	return (
		<Paper className="order-card" elevation={0}>
			<div className="order-card-top"><strong>{order.order_number}</strong><span>{new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span></div>
			<div className="order-customer">{order.customer.name}</div>
			<div className="order-items">{order.items.map((item) => <div key={item.product_id}><span>{item.quantity} × {productById.get(item.product_id) ?? `Produit #${item.product_id}`}</span></div>)}</div>
			<div className="order-card-bottom"><Chip size="small" label={order.pickup_mode === 'takeaway' ? 'À emporter' : 'Sur place'} /><strong>{Number(order.total_price).toFixed(2)} €</strong></div>
			{next && <Button className="order-action" variant="contained" size="small" fullWidth endIcon={<ArrowForwardRounded />} onClick={() => onAdvance(order, next)}>{action}</Button>}
		</Paper>
	)
}

function ProductManagement({ user, onNotify }: { user: StaffUser; onNotify: (message: string) => void }) {
	const [restaurants, setRestaurants] = useState<Restaurant[]>([])
	const [restaurantId, setRestaurantId] = useState(user.restaurant_id ?? 0)
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [search, setSearch] = useState('')
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editing, setEditing] = useState<Product | null>(null)
	const [form, setForm] = useState<ProductInput>(emptyProduct)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		api.get<Restaurant[]>('/restaurants').then(({ data }) => {
			setRestaurants(data)
			if (!restaurantId && data.length) setRestaurantId(data[0].id)
		}).catch((requestError) => setError(getErrorMessage(requestError)))
	}, [])

	useEffect(() => {
		if (!restaurantId) return
		setLoading(true)
		api.get<Product[]>('/products', { params: { restaurant_id: restaurantId } })
			.then(({ data }) => { setProducts(data); setError('') })
			.catch((requestError) => setError(getErrorMessage(requestError)))
			.finally(() => setLoading(false))
	}, [restaurantId])

	const openCreate = () => {
		setEditing(null)
		setForm({ ...emptyProduct, restaurant_id: restaurantId })
		setDialogOpen(true)
	}

	const openEdit = (product: Product) => {
		setEditing(product)
		setForm({ ...product, ingredients: [...product.ingredients] })
		setDialogOpen(true)
	}

	const saveProduct = async (event: FormEvent) => {
		event.preventDefault()
		setSaving(true)
		try {
			const body = { ...form, price: Number(form.price), restaurant_id: restaurantId }
			const { data } = editing
				? await api.patch<Product>(`/products/${editing.id}`, body)
				: await api.post<Product>('/products', body)
			setProducts((current) => editing ? current.map((item) => item.id === data.id ? data : item) : [...current, data])
			setDialogOpen(false)
			onNotify(editing ? 'Produit modifié' : 'Produit ajouté à la carte')
		} catch (requestError) { setError(getErrorMessage(requestError)) }
		finally { setSaving(false) }
	}

	const toggleAvailability = async (product: Product) => {
		try {
			const { data } = await api.patch<Product>(`/products/${product.id}/availability`, { is_available: !product.is_available })
			setProducts((current) => current.map((item) => item.id === data.id ? data : item))
			onNotify(data.is_available ? `${data.name} est disponible` : `${data.name} est en rupture`)
		} catch (requestError) { setError(getErrorMessage(requestError)) }
	}

	const deleteProduct = async (product: Product) => {
		if (!window.confirm(`Supprimer « ${product.name} » de la carte ?`)) return
		try {
			await api.delete(`/products/${product.id}`)
			setProducts((current) => current.filter((item) => item.id !== product.id))
			onNotify('Produit supprimé')
		} catch (requestError) { setError(getErrorMessage(requestError)) }
	}

	const visibleProducts = products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase()))
	const restaurant = restaurants.find((item) => item.id === restaurantId)

	return (
		<section className="content-area">
			<div className="menu-toolbar">
				<div className="service-copy"><span className="eyebrow">CATALOGUE PRODUITS</span><p>{products.length} référence{products.length > 1 ? 's' : ''} · {products.filter((product) => product.is_available).length} disponible{products.filter((product) => product.is_available).length > 1 ? 's' : ''}</p></div>
				<div className="toolbar-controls">
					{user.role === 'staff' ? <div className="restaurant-fixed"><RestaurantMenuRounded fontSize="small" />{restaurant?.name ?? 'Mon restaurant'}</div> : (
						<FormControl size="small" className="restaurant-select"><Select value={restaurantId || ''} onChange={(event) => setRestaurantId(Number(event.target.value))} aria-label="Filtrer par restaurant">{restaurants.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}</Select></FormControl>
					)}
					<TextField size="small" placeholder="Rechercher un produit" value={search} onChange={(event) => setSearch(event.target.value)} className="product-search" InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment> }} />
					<Button variant="contained" startIcon={<AddRounded />} onClick={openCreate}>Nouveau produit</Button>
				</div>
			</div>
			{error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
			<Paper className="product-table-wrap" elevation={0}>
				<div className="product-table-heading"><span>PRODUIT</span><span>CATÉGORIE</span><span>PRIX</span><span>DISPONIBILITÉ</span><span aria-label="Actions" /></div>
				{loading ? <div className="loading-state"><CircularProgress /><span>Chargement de la carte</span></div> : visibleProducts.map((product) => (
					<div className="product-row" key={product.id}>
						<div className="product-identity"><div className="product-thumb">{product.image ? <img src={product.image} alt="" /> : <ShoppingBagOutlined />}</div><div><strong>{product.name}</strong><span>{product.description}</span></div></div>
						<div className="product-category">{product.category}</div>
						<strong className="product-price">{Number(product.price).toFixed(2)} €</strong>
						<div className="availability"><Switch checked={product.is_available} onChange={() => void toggleAvailability(product)} inputProps={{ 'aria-label': `Disponibilité de ${product.name}` }} size="small" /><span className={product.is_available ? 'available-label' : 'unavailable-label'}>{product.is_available ? 'Disponible' : 'Indisponible'}</span></div>
						<div className="product-actions"><Tooltip title="Modifier"><IconButton aria-label={`Modifier ${product.name}`} onClick={() => openEdit(product)}><EditRounded fontSize="small" /></IconButton></Tooltip><Tooltip title="Supprimer"><IconButton aria-label={`Supprimer ${product.name}`} onClick={() => void deleteProduct(product)}><DeleteOutlineRounded fontSize="small" /></IconButton></Tooltip></div>
					</div>
				))}
				{!loading && !visibleProducts.length && <div className="empty-products">Aucun produit pour {search ? 'cette recherche' : 'ce restaurant'}.</div>}
			</Paper>
			<footer className="board-footer"><span>{restaurant?.name ?? 'Restaurant'}</span><span>Les modifications sont visibles sur la carte client.</span></footer>
			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
				<form onSubmit={saveProduct}>
					<DialogTitle>{editing ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
					<DialogContent className="product-form-content">
						<TextField label="Nom du produit" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required fullWidth autoFocus />
						<div className="form-two-col"><TextField label="Catégorie" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required fullWidth /><TextField label="Prix (€)" type="number" value={form.price || ''} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} inputProps={{ min: 0, step: '0.01' }} required fullWidth /></div>
						<TextField label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} multiline minRows={2} required fullWidth />
						<TextField label="URL de l'image" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} required fullWidth />
						<TextField label="Ingrédients" value={form.ingredients.join(', ')} onChange={(event) => setForm({ ...form, ingredients: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} helperText="Séparez les ingrédients par une virgule" required fullWidth />
					</DialogContent>
					<DialogActions><Button onClick={() => setDialogOpen(false)} color="inherit">Annuler</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Créer le produit'}</Button></DialogActions>
				</form>
			</Dialog>
		</section>
	)
}

function roleName(role: StaffUser['role']) {
	return role === 'staff' ? 'Équipe cuisine' : role === 'admin' ? 'Administration' : 'Direction'
}

function statusLabel(status: OrderStatus) {
	return status === 'preparing' ? 'En préparation' : status === 'ready' ? 'Prête' : status === 'pending' ? 'En attente' : status
}

export default App
