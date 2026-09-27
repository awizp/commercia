import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router";
import toast from "react-hot-toast";

import { Collections, Feature, FeatureBanner, Footer, ImgCarousel, Navbar } from "../components";
import { HomeLoader, PageTitle } from "../components/ui";
import { getProduct, removeErrors } from "../features/products/productSlice.js";

const Home = () => {

    // getting product state from redux store
    const { products = [], loading = false, error = null } = useSelector((state) => state.products || state.product || {});

    // getting products by calling dispatch func
    const dispatch = useDispatch();

    // if dispatch has any changes it will get products automatcially
    useEffect(() => {
        dispatch(getProduct({ page: 1 }));
    }, [dispatch]);

    // error handling
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    return (
        loading ? <HomeLoader /> : (
            <>
                <PageTitle title="Commercia | Good vibes and great finds | Buy coolest products in online anywhere at anytime!" />
                <Navbar />
                <ImgCarousel />
                <FeatureBanner />
                <Feature products={products} />
                <Collections products={products} />
                <Footer />
            </>
        )
    );
};

export default Home;