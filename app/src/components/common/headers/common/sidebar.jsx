import React, {Component} from 'react';
import $ from 'jquery';
import 'smartmenus';
import {Link} from "react-router-dom";

class SideBar extends Component {

    componentWillMount (){
        $(function() {
            $('#sub-menu').smartmenus({
                subMenusSubOffsetX: 1,
                subMenusSubOffsetY: -8
            });
        });
    }

    closeNav() {
        var closemyslide = document.getElementById("mySidenav");
        if(closemyslide)
            closemyslide.classList.remove('open-side');
    }

    render() {
        return (
            <div id="mySidenav" className="sidenav">
                <a href="javascript:void(0)" className="sidebar-overlay" onClick={this.closeNav}></a>
                <nav>
                    <div onClick={this.closeNav}>
                        <div className="sidebar-back text-left">
                            <i className="fa fa-angle-left pr-2" aria-hidden="true"></i> Back
                        </div>
                    </div>
                    {/*Vertical Menu*/}
                    <ul id="sub-menu" className="sm pixelstrap sm-vertical ">
                        <li>
                            <Link to={`${process.env.PUBLIC_URL}/product/category/raw_materials`}>
                                Raw Materials
                            </Link>
                        </li>
                        <li>
                            <Link to={`${process.env.PUBLIC_URL}/product/category/beauty_products`}>
                                Beauty Products
                            </Link>
                        </li>
                        <li>
                            <Link to={`${process.env.PUBLIC_URL}/product/category/electronics`}>
                                Electronic Products
                            </Link>
                        </li>
                        <li>
                            <Link to={`${process.env.PUBLIC_URL}/product/category/devices`}>
                                Phones & Tablets
                            </Link>
                        </li>
                        <li>
                            <Link to={`${process.env.PUBLIC_URL}/product/category/computers`}>
                                Computer Products
                            </Link>
                        </li>
                        <li>
                            <Link to={`${process.env.PUBLIC_URL}/product/category/fashion`}>
                                Fashion Products
                            </Link>
                        </li>
                        <li>
                            <Link to={`${process.env.PUBLIC_URL}/product/category/manufacturing`}>
                                Manufacturing Products
                            </Link>
                        </li>


                    </ul>
                </nav>
            </div>
        )
    }
}


export default SideBar;