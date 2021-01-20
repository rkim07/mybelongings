import * as Url from 'url-parse';

export class ImageHelperImpl {
    public getImagePath(url, image): string {
        const urlObj = new Url(url);
        const origin = urlObj.origin;

        return image ? `${origin}/${image}` : `${origin}/no_pic.png`;
    }
}

const ImageHelper = new ImageHelperImpl();

export {
    ImageHelper
};
