import React, {Component} from 'react';
import Slider from 'react-slick';
import '../../common/index.scss';
import {connect} from "react-redux";

// import custom Components
import NewProduct from "../../common/new-product";
import Breadcrumb from "../../common/breadcrumb";
import StickyBox from "react-sticky-box";
import Filter from "./filter";
import FilterBar from "./filter-bar";
import ProductListing from "./product-listing";
import { getProductCategory } from '../../../actions'
import PropTypes from "prop-types";
import {FASHION_PRODUCTS_ENDPOINT} from "../../../constants/endpoints";
import {FASHION_PRODUCT} from "../../../constants/ActionTypes";




class FashionCategory extends Component {

    openFilter = () => {
        document.querySelector(".categories-filter").style = "left: -15px";
    }

    componentWillMount(){
        this.props.getProductCategory(FASHION_PRODUCTS_ENDPOINT,FASHION_PRODUCT);
    }
    render() {
        return (
            <div>

                <Breadcrumb title={'Fashion Corner'}/>

                <section className="section-b-space">
                    <div className="collection-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-3 collection-filter">

                                    <StickyBox offsetTop={20} offsetBottom={20}>
                                        <div>
                                            <Filter/>
                                            <NewProduct/>
                                            <div className="collection-sidebar-banner">
                                                <a href="#">
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/side-banner.png`}
                                                         className="img-fluid" alt=""/>
                                                </a>
                                            </div>
                                        </div>
                                    </StickyBox>
                                    {/*side-bar banner end here*/}
                                </div>
                                <div className="collection-content col">
                                    <div className="page-main-content ">
                                        <div className="">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="top-banner-wrapper">
                                                        <a href="#"><img
                                                            src={`${process.env.PUBLIC_URL}/assets/images/home-banner/1.jpg`}
                                                            className="img-fluid" alt=""/></a>
                                                        <div className="top-banner-content small-section">
                                                            <h4>Fashion & Lifestyle</h4>
                                                            <h5>Browse through our array of carefully curated lifestyle products from local Nigerian
                                                                brands designed to meet your needs. From clothes and shoes to bags and accessories,
                                                                stay on top of all the latest fashion trends with Purchase Naija.</h5>
                                                        </div>
                                                    </div>
                                                    <div className="collection-product-wrapper">
                                                        <div className="product-top-filter">
                                                            <div className="container-fluid p-0">
                                                                <div className="row">
                                                                    <div className="col-xl-12">
                                                                        <div className="filter-main-btn">
                                                                            <span onClick={this.openFilter}
                                                                                  className="filter-btn btn btn-theme"><i
                                                                                className="fa fa-filter"
                                                                                aria-hidden="true"></i> Filter</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <FilterBar/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/*Products Listing Component*/}
                                                        <ProductListing/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        )
    }

}

FashionCategory.propTypes = {
    getProductCategory: PropTypes.func.isRequired
};

export default connect(null,{getProductCategory})(FashionCategory);
