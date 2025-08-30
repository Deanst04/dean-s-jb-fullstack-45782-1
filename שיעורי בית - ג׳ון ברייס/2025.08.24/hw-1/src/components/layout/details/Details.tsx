import './Details.css'
import img1 from '../../../assets/images/image1.png'
import img2 from '../../../assets/images/image2.png'
import img3 from '../../../assets/images/image3.png'


export default function Details() {

    const imgArr = [img1, img2, img3]
    const randomImg = imgArr[Math.floor(Math.random() * imgArr.length)]

    return (
        <div className='Details'>
            <h3>who am i?</h3>
            <ul>
                <li>im a fullstack developer</li>
                <li>im a funny person</li>
                <li>idk 🤷‍♂️</li>
            </ul>
            <img src={randomImg} />
        </div>
    )

}