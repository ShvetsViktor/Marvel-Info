import ComicInfo from '../comicInfo/ComicInfo';
import AppBanner from '../appBanner/AppBanner';
import ErrorBoundary from "../errorBoundary/ErrorBoundary";


const ComicInfoPage = (props) => {


    return (
        <>
            <AppBanner />
            <ErrorBoundary>
                <ComicInfo comicId={1} />
            </ErrorBoundary>
        </>
    )
}

export default ComicInfoPage;