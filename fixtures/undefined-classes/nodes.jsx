export function App() {
  const className = "definedClass undefinedClass"
  const fooClassName = " definedClass " + " undefinedClass "
  const barClass = ` undefinedClass ${1} definedClass `
  const props = {
    className: " definedClass " + " undefinedClass ",
    class: "definedClass undefinedClass",
    fnClass: () => "definedClass fnClass",
    objClass: { definedWrapper: "definedClass", objWrapper: "objClass" },
    fooClass: `definedClass ${1} undefinedClass`,
  }
  return (
    <main randomProp="randomPropClass">
      <div
        class="definedClass undefinedClass"
        className="definedClass  undefinedClass"
        altClass={"definedClass \uA66E undefinedClass"}
        altClassName={"definedClass \uFDFD undefinedClass"}
      />
      <div className={" definedClass " + " undefinedClass "} />
      <div
        class={() => {
          return "callbackClass"
        }}
      />
      <div
        classNames={
          <span otherProp="otherPropClass">
            {"childClass" + "alsoChildClass"}
          </span>
        }
      />
      <div
        classes={`
          definedClass
          undefinedClass
          definedClass
        `}
      />
      <App {...props} className={`${className} undefinedClass`} />
      <App {...props} class={fooClassName + " undefinedClass"} />
      <span className={clsx(barClass, "undefinedClass")} />
    </main>
  )
}
