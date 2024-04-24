const Loader = () => {
    return (
        <div className="loading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

export default Loader;

interface SkeletonProps {
    width?: string;
    length?: number;
    height?: string;
    bgColor?: string;
}

export const Skeleton = ({
    width = "100%",
    height = "2rem",
    length = 6,
    bgColor = "gray",
}: SkeletonProps) => {
    const skeletions = Array.from({ length }, (_, idx) => (
        <div key={idx} style={{ height, backgroundColor: bgColor }} className="skeleton-shape"></div>
    ));

    return (
        <div className="skeleton-loader" style={{ width }}>
            {skeletions}
        </div>
    );
};
