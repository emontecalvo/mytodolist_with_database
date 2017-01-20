import React from 'react';
import {connect} from 'react-redux';
import Home from './home';


class Container extends React.Component {



	render() {
		console.log("window", window.TOKEN);
		if(!window.TOKEN) {
			return (<div>
			<section>
				<div>
					<h3>welcome to</h3>
					<div>
						<h1>myBlog</h1>
					</div>
				</div>
			</section>
			<section>
				<a href="/auth/google">
					<img src='./btn_google_signin.png' />
				</a>
			</section>

		</div>
	)
		} else {
			return <div>
				<Home />
			</div>;
		}
	}
}

module.exports = Container;