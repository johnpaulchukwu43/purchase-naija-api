import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual'
import './index.scss';

// Import custom components
import store from './store';
import translations from './constants/translations'
import {getAllProducts} from './actions'
import Fashion from './components/layouts/fashion';
import Index from './components/layouts/index';
import jwtDecode from 'jwt-decode';

//Category imports
import PhonesCategory from './components/categories/phones'
import RawMaterialsCategory from './components/categories/raw_materials'
import ManufactruingCategory from './components/categories/manufacturing'
import FashionCategory from './components/categories/fashion/index'
import ElectronicsCategory from './components/categories/electronics'
import ComputerCategory from './components/categories/computer'
import BeautyCategory from './components/categories/beauty'



//Collection Pages
import CollectionLeftSidebar from "./components/categories/collection-left-sidebar";
import CollectionNoSidebar from "./components/categories/collection-no-sidebar";
import CollectionRightSidebar from "./components/categories/collection-right-sidebar";

// Product Pages
import SingleProduct from "./components/product/single-product";
import LeftSideBar from "./components/product/left-sidebar";
import RightSideBar from "./components/product/right-sidebar";
import NoSideBar from "./components/product/no-sidebar";
import LeftImage from "./components/product/left-image";
import RightImage from "./components/product/right-image";
import Accordian from "./components/product/accordian";
import ColumnLeft from "./components/product/column-left";
import ColumnRight from "./components/product/column-right";
import Column from "./components/product/column";
import Vertical from "./components/product/vertical";

// Features
import Layout from './components/app'
import Cart from './components/cart'
import Compare from './components/compare/index'
import wishList from './components/wishlist'
import checkOut from './components/checkout'
import orderSuccess from './components/checkout/success-page'

// Extra Pages
import aboutUs from './components/pages/about-us'
import PageNotFound from './components/pages/404'
import lookbook from './components/pages/lookbook'
import Login from './components/pages/login'
import Register from './components/pages/register'
import RegisterServiceProvider from './components/pages/register-service-provider'
import LoginServiceProvider from './components/pages/login-service-provider'
import Search from './components/pages/search'
import Collection from './components/pages/collection'
import ForgetPassword from './components/pages/forget-password'
import Contact from './components/pages/contact'
import Dashboard from './components/pages/dashboard'
import Faq from './components/pages/faq'

// Blog Pages
import RightSide from './components/blogs/right-sidebar'
import Details from './components/blogs/details'
import BlogPage from './components/blogs/blog-page'
import setAuthorizationToken from "./utils/setAuthorizationToken";
import {setCurrentUser} from "./actions/AuthActions";
import Phones from "./components/categories/phones";
import {FASHION_PRODUCT} from "./constants/ActionTypes";
import {FASHION_SINGLE_PRODUCT_ROUTE} from "./constants/app-routes";



class Root extends React.Component {


    render() {

        if (localStorage.jwtToken) {
            setAuthorizationToken(localStorage.jwtToken);
            store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
        }

        store.dispatch(getAllProducts());
        return(
        	<Provider store={store}>
                <IntlProvider translations={translations} locale='en'>
				<BrowserRouter basename={'/'} >
					<ScrollContext>
                        <Layout>
                            <Switch>
								<Route exact path={`${process.env.PUBLIC_URL}/`} component={Index}/>
                                {/*Product Categories*/}
                                <Route path={`${process.env.PUBLIC_URL}/product/category/devices`} component={Phones}/>
                                <Route path={`${process.env.PUBLIC_URL}/product/category/manufacturing`} component={ManufactruingCategory}/>
                                <Route path={`${process.env.PUBLIC_URL}/product/category/fashion`} component={FashionCategory}/>
                                <Route path={`${process.env.PUBLIC_URL}/product/category/computers`} component={ComputerCategory}/>
                                <Route path={`${process.env.PUBLIC_URL}/product/category/raw_materials`} component={RawMaterialsCategory}/>
                                <Route path={`${process.env.PUBLIC_URL}/product/category/beauty_products`} component={BeautyCategory}/>
                                <Route path={`${process.env.PUBLIC_URL}/product/category/electronics`} component={ElectronicsCategory}/>


                                {/*Fashion*/}
                                <Route path={`${process.env.PUBLIC_URL}/fashion`} component={Fashion}/>


                                {/*Routes For Features (Product Collection) */}
								<Route path={`${process.env.PUBLIC_URL}/left-sidebar/collection`} component={CollectionLeftSidebar}/>
								<Route path={`${process.env.PUBLIC_URL}/no-sidebar/collection`} component={CollectionNoSidebar}/>
								<Route path={`${process.env.PUBLIC_URL}/right-sidebar/collection`} component={CollectionRightSidebar}/>

								{/*Routes For Single Product*/}
								<Route path={`${FASHION_SINGLE_PRODUCT_ROUTE}/:id`}
                                       render={(props) => <SingleProduct {...props} categoryType={FASHION_PRODUCT}/>}/>
								<Route path={`${process.env.PUBLIC_URL}/left-sidebar/product/:id`} component={LeftSideBar}/>
								<Route path={`${process.env.PUBLIC_URL}/right-sidebar/product/:id`} component={RightSideBar}/>
								<Route path={`${process.env.PUBLIC_URL}/no-sidebar/product/:id`} component={NoSideBar}/>
								<Route path={`${process.env.PUBLIC_URL}/col-left/product/:id`} component={ColumnLeft}/>
								<Route path={`${process.env.PUBLIC_URL}/col-right/product/:id`} component={ColumnRight}/>
                                <Route path={`${process.env.PUBLIC_URL}/accordian/product/:id`} component={Accordian}/>
								<Route path={`${process.env.PUBLIC_URL}/column/product/:id`} component={Column}/>
								<Route path={`${process.env.PUBLIC_URL}/left-image/product/:id`} component={LeftImage}/>
								<Route path={`${process.env.PUBLIC_URL}/right-image/product/:id`} component={RightImage}/>
								<Route path={`${process.env.PUBLIC_URL}/vertical/product/:id`} component={Vertical}/>


								{/*Routes For custom Features*/}
								<Route path={`${process.env.PUBLIC_URL}/cart`} component={Cart}/>
								<Route path={`${process.env.PUBLIC_URL}/wishlist`} component={wishList}/>
								<Route path={`${process.env.PUBLIC_URL}/compare`} component={Compare}/>
								<Route path={`${process.env.PUBLIC_URL}/checkout`} component={checkOut}/>
								<Route path={`${process.env.PUBLIC_URL}/order-success`} component={orderSuccess}/>

								{/*Routes For Extra Pages*/}
                                <Route path={`${process.env.PUBLIC_URL}/pages/about-us`} component={aboutUs}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/404`} component={PageNotFound}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/lookbook`} component={lookbook}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/user/login`} component={Login}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/user/register`} component={Register}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/service-provider/register`} component={RegisterServiceProvider}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/service-provider/login`} component={LoginServiceProvider}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/search`} component={Search}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/collection`} component={Collection}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/forget-password`} component={ForgetPassword}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/contact`} component={Contact}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/dashboard`} component={Dashboard}/>
                                <Route path={`${process.env.PUBLIC_URL}/pages/faq`} component={Faq}/>

								{/*Blog Pages*/}
                                <Route path={`${process.env.PUBLIC_URL}/blog/right-sidebar`} component={RightSide}/>
                                <Route path={`${process.env.PUBLIC_URL}/blog/details`} component={Details}/>
                                <Route path={`${process.env.PUBLIC_URL}/blog/blog-page`} component={BlogPage}/>

								<Route component={PageNotFound} />
                            </Switch>
						</Layout>
					  </ScrollContext>
					</BrowserRouter>
                </IntlProvider>
			</Provider>
    	);
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));


