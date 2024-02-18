
interface Props extends React.HTMLProps<HTMLDivElement> { }

const Examples = (props: Props) => {
  return (
    <div {...props}>
      <a href='#examples' hidden>Examples</a>
      <h2 className='text-2xl font-bold mb-2 underline'>Examples</h2>
    </div>
  )
}

export default Examples;