import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {

}

const About = (props: Props) => {

    return (
        <div {...props}>
            <a href='#about' hidden>About</a>
            <span className='text-4xl'>A simple, customizable tree component for React.</span>
        </div>
    );
}

export default About;