export function App() {
  const className = "definedClass undefinedClass"
  const fooClassName = " definedClass " + " undefinedClass "
  const barClass = `definedClass ${1} undefinedClass`
  const props = {
    className: " definedClass " + " undefinedClass ",
    class: "definedClass undefinedClass",
    fooClass: `definedClass ${1} undefinedClass`,
  }
  return (
    <>
      <div
        class="definedClass undefinedClass"
        className="definedClass undefinedClass"
      />
      <div
        class={"definedClass undefinedClass"}
        className={"definedClass undefinedClass"}
      />
      <div className={" definedClass " + " undefinedClass "} />
      <div
        className={`
          definedClass
          undefinedClass
          definedClass
        `}
      />
      <App {...props} className={`${className} undefinedClass`} />
      <App {...props} class={fooClassName + " undefinedClass"} />
      <span className={clsx(barClass, "undefinedClass")} />
    </>
  )
}
