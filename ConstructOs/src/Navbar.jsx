import './Css/navbar.css'
function Nav(){
    return(<header>

        <div className="search">
            <input type="text" placeholder="Search..."/>
        </div>
        
        <div className="right-sec">
            <button>Notification</button>

            <div className="profile-container">
                <p>Profile</p>
                <img src="" alt="profile" />
            <div className="user-info">
                    <p>Name</p>
                    <p>Role</p>
            </div>
            </div>
        </div>

    </header>);
}
export default Nav;

