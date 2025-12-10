import { Link } from "react-router-dom"
import NotFoundGif from "@/assets/404_not_found.gif"

const NotFound = () => {
	return (
		<section className="py-10 bg-white font-serif overflow-hidden">
			<div className="container mx-auto">
				<div className="flex justify-center">
					<div className="text-center w-full max-w-3xl">
						{/* 404 Background */}
						<div className="h-[500px] flex items-center justify-center flex-col">
							<h1 className="text-7xl font-bold">404</h1>
							<img
								alt="Not Found"
								className="min-h-2/3"
								src={NotFoundGif}
							/>
						</div>

						{/* Content Box */}
						<div className="-mt-12">
							<h3 className="text-2xl font-semibold">
								Look like you're lost
							</h3>
							<p className="text-gray-600 mt-2">
								The page you are looking for is not available!
							</p>

							<Link
								className="inline-block mt-5 px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
								to="/"
							>
								Go to Home
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default NotFound
