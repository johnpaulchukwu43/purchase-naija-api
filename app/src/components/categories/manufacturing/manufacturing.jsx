import React, {Component} from 'react';
import '../../common/index.scss';

// import custom Components
import Breadcrumb from "../../common/breadcrumb";
import FilterBar from "./filter-bar";
import ProductListing from "./product-listing";
import EmptyProductList from "../../common/empty-products-list";


class ManufacturingCategory extends Component {


    render(){

        return (
            <div>
                <Breadcrumb title={'Manufacturing Collection'} />

                {/*Section Start*/}
                <section className="section-b-space">
                    <div className="collection-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="collection-content col">
                                    <div className="page-main-content">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="top-banner-wrapper">
                                                        <a href="#"><img src={`${process.env.PUBLIC_URL}/assets/images/mega-menu/2.jpg`}
                                                                         className="img-fluid" alt=""/></a>
                                                        <div className="top-banner-content small-section">
                                                            <h4>Manufacturing Products</h4>
                                                            <h5>
                                                                Order from a large selection of our products from our  adept Artisans  from
                                                                trusted stores in Nigeria.</h5>
                                                        </div>
                                                    </div>
                                                    <EmptyProductList/>
                                                    {/*<div className="collection-product-wrapper">*/}
                                                        {/*<div className="product-top-filter">*/}
                                                            {/*<div className="container-fluid p-0">*/}
                                                                {/*<div className="row">*/}
                                                                    {/*<div className="col-12">*/}
                                                                        {/*<FilterBar/>*/}
                                                                    {/*</div>*/}
                                                                {/*</div>*/}
                                                            {/*</div>*/}
                                                        {/*</div>*/}

                                                        {/*<div className="product-wrapper-grid">*/}
                                                            {/*<div className="container-fluid">*/}
                                                                {/*<div className="row">*/}
                                                                    {/*<ProductListing/>*/}
                                                                {/*</div>*/}
                                                            {/*</div>*/}
                                                        {/*</div>*/}
                                                    {/*</div>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/*Section End*/}

            </div>
        )
    }
}

export default ManufacturingCategory;
