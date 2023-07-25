import Link from "next/link"

const FormTitle = () => {
  return (
    <div>
      <Link href = '/'>
        <div className = "flex items-center justify-center">
          <h2 className = "text-center text-7xl inline-block rounded-full px-8 py-4 bg-fourth font-extrabold text-secondary">GeoBook</h2>
        </div>
      </Link>
    </div>
  )
}

export default FormTitle