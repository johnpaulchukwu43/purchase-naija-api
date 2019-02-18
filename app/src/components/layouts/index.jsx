import React from "react";
import {Link} from 'react-router-dom';
import Slider from 'react-slick';

import '../common/index.scss';
import LatestCollection from "../categories/LatestCollection";

const Content = props => {

    const sponsorImgStyle = {height: '20vh', marginTop: '10px', marginLeft: '30px'};

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoPlay: true,
        autoplaySpeed: 1000
    };
    return <div>

        <div className="row">

            {/*<div className="col-sm-12 col-lg-3">*/}
            {/*/!*Home Slider*!/*/}
            {/*<div className="container">*/}
            {/*</div>*/}
            {/*/!*Home Section End*!/*/}
            {/*</div>*/}
            <div className="col-sm-12 col-lg-12">
                <div className="container">
                    <section className="p-0">
                        <Slider {...settings} className="slide-1 home-slider">
                            <div>
                                <div className="home home1 text-center img-fluid">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="slider-contain">
                                                    <div>
                                                        <div>
                                                            <h4>welcome to fashion</h4>
                                                            <h1>men fashion</h1>
                                                            <Link to="/" className="btn btn-solid"> shop now</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="home home2 text-center img-fluid">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="slider-contain">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </section>
                </div>
            </div>
        </div>


        {/*Sponsors*/}
        <div className="container">
            <div className="row">
                <div className="col-lg-2 col-sm-4 col-xs-6">
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/sponsors/logo-dangote.jpg`}
                        className="img-responsive"
                        style={sponsorImgStyle}/>
                </div>
                <div className="col-lg-2 col-sm-4 col-xs-6">
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/sponsors/logo-ivm.jpg`}
                        className="img-responsive"
                        style={sponsorImgStyle}/>
                </div>
                <div className="col-lg-2 col-sm-4 col-xs-6">
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/sponsors/logo-daviva.jpg`}

                        className="img-responsive"
                        style={sponsorImgStyle}/>
                </div>
                <div className="col-lg-2 col-sm-4 col-xs-6">
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/sponsors/logo-zaron.jpg`}
                        className="img-responsive" style={sponsorImgStyle}/>
                </div>
                <div className="col-lg-2 col-sm-4 col-xs-6">
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/sponsors/logo-kene-rapu.jpg`}
                        className="img-responsive"
                        style={sponsorImgStyle}/>
                </div>
                <div className="col-lg-2 col-sm-4 col-xs-6">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/sponsors/logo-ezra-footwears.jpg`}
                         className="img-responsive"
                         style={sponsorImgStyle}/>
                </div>
            </div>
        </div>
        {/*sponsrs*/}

        {/*Categories*/}

        <section className="flat-row row-image-box">
            <div className="container">
                <div className="title1  section-t-space">

                    <h2 className="title-inner1"> Product Categories</h2>
                </div>
                <div className="row gutter-10">
                    <div className="col-sm-6 col-md-4">
                        <div className="flat-image-box style-1 data-effect div-h22 clearfix">
                            <div className="item data-effect-item">
                                <div className="inner">
                                    <div className="thumb h-large">
                                        <div id="carouselExampleSlidesOnly" className="carousel slide"
                                             data-ride="carousel">
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-gold.jpg`}
                                                    />
                                                </div>
                                                <div className="carousel-item">
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-gold.jpg`}
                                                         alt="Second slide"/>
                                                </div>
                                                <div className="carousel-item">
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-gold.jpg`}
                                                         alt="Third slide"/>
                                                </div>
                                            </div>
                                            <div style={{position: 'absolute', top: '50%', left: '20%'}}>
                                                <Link to="/">
                                                    <h4 style={{
                                                        color: 'white',
                                                        font: 'size 10px',
                                                        fontWeight: 'bold'
                                                    }}>RAW
                                                        MATERIALS</h4>
                                                </Link>
                                                <i className="fa fa-angle-down fa-2x"
                                                   style={{color: 'white', marginLeft: '80px', cursor: 'pointer'}}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-4">
                        <div className="flat-image-box style-1 row2 data-effect clearfix">
                            <div className="item data-effect-item">
                                <div className="inner">
                                    <div className="thumb h-small">
                                        <div id="carouselExampleSlidesOnly" className="carousel slide"
                                             data-ride="carousel">
                                            <div className="carousel-inner">
                                                <div className="carousel-item active" style={{height: '50%'}}>
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-manufacturing.jpg`}
                                                         alt="Raw Materials"/>
                                                </div>
                                                <div className=" carousel-item" style={{height: '50%'}}>
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-manufacturing.jpg`}
                                                         alt="Second slide"/>
                                                </div>
                                                <div className="carousel-item" style={{height: '50%'}}>
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-manufacturing.jpg`}
                                                         alt="Third slide"/>
                                                </div>
                                            </div>
                                            <div style={{position: 'absolute', top: '50%', left: '20%'}}>
                                                <Link to="/">
                                                    <h4 style={{
                                                        color: 'white',
                                                        font: 'size 10px',
                                                        fontWeight: 'bold'
                                                    }}>MANUFACTURING</h4>
                                                </Link>
                                                <i className="fa fa-angle-down fa-2x"
                                                   style={{color: 'white', marginLeft: '80px', cursor: 'pointer'}}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="item data-effect-item">
                                <div className="inner">
                                    <div className="thumb h-small">
                                        <div id="carouselExampleSlidesOnly" className="carousel slide"
                                             data-ride="carousel">
                                            <div className="carousel-inner">
                                                <div className="carousel-item active" style={{height: '50%'}}>
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-products.jpg`}
                                                         alt="Raw Materials"/>
                                                </div>
                                                <div className=" carousel-item" style={{height: '50%'}}>
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-products.jpg`}
                                                         alt="Second slide"/>
                                                </div>
                                                <div className="carousel-item" style={{height: "50%"}}>
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-products.jpg`}
                                                         alt="Third slide"/>
                                                </div>
                                            </div>

                                        </div>
                                        <div style={{position: 'absolute', top: '50%', left: '30%'}}>
                                            <h4 style={{color: 'white', font: '10', fontWeight: 'bold'}}>PRODUCTS</h4>
                                            <i className="fa fa-angle-down fa-2x"
                                               style={{color: 'white', marginLeft: '50px', cursor: 'pointer'}}></i>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*col-md-4*/}
                    <div className="col-sm-6 col-md-4">
                        <div className="flat-image-box style-1 data-effect div-h22 clearfix">
                            <div className="item data-effect-item">
                                <div className="inner">
                                    <div className="thumb h-large">
                                        <div id="carouselExampleSlidesOnly" className="carousel slide"
                                             data-ride="carousel">
                                            <div className="carousel-inner">
                                                <div className="carousel-item active" style={{height: '60%'}}>
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-services.jpg`}
                                                         alt="Raw Materials"/>
                                                </div>
                                                <div className=" carousel-item" style={{height: '60%'}}>
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-services.jpg`}
                                                         alt="Second slide"/>
                                                </div>
                                                <div className="carousel-item" style={{height: '60%'}}>
                                                    <img className="d-block w-100"
                                                         src={`${process.env.PUBLIC_URL}/assets/images/categories/hp-services.jpg`}
                                                         alt="Third slide"/>
                                                </div>
                                            </div>

                                        </div>


                                        <div style={{position: 'absolute', top: '50%', left: '35%'}}>
                                            <h4 style={{color: "#fff", font: "size 10px"}}>SERVICE</h4>
                                            <i className="fa fa-angle-down fa-2x"
                                               style={{color: 'white', marginLeft: '40px', cursor: 'pointer'}}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*col-md-4*/}
                </div>
            </div>
        </section>
        {/*Categories*/}

        {/*Latest Collection*/}
        <LatestCollection/>
        {/*Latest Collection End*/}






    </div>;
};

export default Content;
