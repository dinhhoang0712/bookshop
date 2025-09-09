
import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "styles/book.scss"

interface ModalGalleryProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentIndex: number;
    items: {
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[];
    title: string;
}

const ModalGallery = (props: ModalGalleryProps) => {
    const { isOpen, setIsOpen, title, currentIndex, items } = props;

    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }
    }, [isOpen, currentIndex]);

    return (
        <Modal
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            width={1000}
            footer={null}
            closable={false}
            className="modal-gallery"
            centered
        >
            <Row gutter={[20, 20]}>
                <Col span={16}>
                    <ImageGallery
                        ref={refGallery}
                        items={items}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        showThumbnails={false}
                        startIndex={activeIndex}
                        onSlide={(index) => setActiveIndex(index)}
                        slideDuration={0}
                    />
                </Col>

                <Col span={8}>
                    <div>{title}</div>
                    <div>
                        <Row gutter={[20, 20]}>
                            {items?.map((item, index) => (
                                <Col key={index}>
                                    <Image
                                        wrapperClassName="img-normal"
                                        width={100}
                                        height={100}
                                        src={item.original}
                                        preview={false}
                                        onClick={() => {
                                            refGallery.current?.slideToIndex(index);
                                        }}
                                    />
                                    <div className={activeIndex === index ? "active" : ""}></div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalGallery;