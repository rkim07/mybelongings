export class ImageHelper {
    static getImagePath(origin, image): string {
        return image ? `${origin}/${image}` : `${origin}/no_pic.png`;
    }
}
