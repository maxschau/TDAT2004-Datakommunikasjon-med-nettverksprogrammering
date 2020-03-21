import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;

public class UDPServer {
    public static void main(String[] args) throws IOException {
        DatagramSocket serverSocket = new DatagramSocket(9876);
        byte[] receiveData = new byte[1024];
        byte[] sendData = new byte[1024];

        while (true) {
            DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
            serverSocket.receive(receivePacket);
            String string = new String(receivePacket.getData());
            System.out.println("The client received the following string: " + string);

            String[] arr = string.split(" ");

            try {
                if (arr[1].equals("+")) {
                    int answer = Integer.parseInt(arr[0]) + Integer.parseInt(arr[2].trim());
                    System.out.println(answer);
                    sendData = ("Answer: " + answer).getBytes();
                } else if (arr[1].equals("-")) {
                    int answer = Integer.parseInt(arr[0]) - Integer.parseInt(arr[2].trim());
                    System.out.println(answer);
                    sendData = ("Answer: " + answer).getBytes();
                } else if (arr[1].equals("/")) {
                    double answer = Double.parseDouble(arr[0]) / Double.parseDouble(arr[2].trim());
                    System.out.println(answer);
                    sendData = ("Answer: " + answer).getBytes();
                } else if (arr[1].equals("*")) {
                    int answer = Integer.parseInt(arr[0]) * Integer.parseInt(arr[2].trim());
                    System.out.println(answer);
                    sendData = ("Answer: " + answer).getBytes();
                } else {
                    sendData = "Unvalid operator. Please try again".getBytes();
                }
            } catch(NumberFormatException ne) {
                sendData = "You must write two numbers".getBytes();
            } finally {
                InetAddress IP = receivePacket.getAddress();
                int port = receivePacket.getPort();
                DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IP, port);
                serverSocket.send(sendPacket);
            }



        }
    }


}
