import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { Navbar, Footer, ProductDetails, Review } from "../components";
import { PageTitle, ProductDetailsLoader, ScrollToTop } from "../components/ui";
import { getProductDetails, removeErrors } from "../features/products/productSlice.js";

const Details = () => {

    // getting product id from url params
    const { id } = useParams();

    // getting product state from redux store
    const { product = [], loading = false, error = null } = useSelector((state) => state.product || state.products || {});

    // getting products by calling dispatch func
    const dispatch = useDispatch();

    // if dispatch has any changes it will get product details automatcially
    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }
    }, [dispatch, id]);

    // error handling
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    return (
        loading ? <ProductDetailsLoader /> : (
            <>
                <ScrollToTop />
                <PageTitle title={`${product?.name} | Details`} />
                <Navbar />
                <ProductDetails product={product} />
                <Review product={product} />
                <Footer />
            </>
        )
    );
};

export default Details;