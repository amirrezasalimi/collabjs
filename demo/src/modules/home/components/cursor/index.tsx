interface Props {
    x: number
    y: number
    color: string
}
const Cursor = ({ x, y, color }: Props) => {
    return <svg className="absolute pointer-events-none" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{
            left: x,
            top: y,
        }}
    >
        <g clip-path="url(#clip0_114_322)">
            <path d="M24 10.4881C24 10.5119 23.9994 10.5346 23.9983 10.5594C23.968 11.1089 23.5954 11.58 23.0665 11.7343L15.0489 14.0819L13.3498 22.6556C13.2423 23.1972 12.8041 23.6115 12.258 23.6891C11.7121 23.7664 11.1759 23.4909 10.9223 23.0002L0.145668 2.19312C-0.105774 1.71068 -0.0260723 1.12017 0.342265 0.718419C0.711593 0.3155 1.29238 0.188429 1.79634 0.397633L23.1991 9.29023C23.6869 9.49196 24 9.96575 24 10.4881Z" fill={color} />
        </g>
        <defs>
            <clipPath id="clip0_114_322">
                <rect width="24" height="24" fill="white" transform="translate(0 24) rotate(-90)" />
            </clipPath>
        </defs>
    </svg>

}
export default Cursor;