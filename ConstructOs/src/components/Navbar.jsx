import '../Css/navbar.css'
import profile from '../assets/profile.png'
function Nav(){
    return(<header>

        <div className="search">
            <input type="text" placeholder="Search..."/>
        </div>
        
        <div className="right-sec">
            <button>Notification</button>

            <div className="profile-container">
                <img src={profile} alt="profile" />
            <div className="user-info">
                    <p>VENGADESSH V</p>
                    <p>Owner of  PVM Constructions</p>
            </div>
            </div>
        </div>

    </header>);
}
export default Nav;

