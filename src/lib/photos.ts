type Photo = { image: Promise<{ default: ImageMetadata }>; path: string; name: string };

export function getPhotos(collection: string): Photo[] {
    const glob = import.meta.glob("../images/**/*.jpg");
    const paths = Object.keys(glob).filter((path) => path.includes(collection));
    const images = paths.map((path) => glob[path]()) as Promise<{ default: ImageMetadata }>[];

    return paths.map((path, i) => ({
        path: path,
        image: images[i],
        name: path.split(".").slice(-2)[0].split("/").slice(-1)[0],
    }));
}
